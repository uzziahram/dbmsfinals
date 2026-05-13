import database from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { Books } from "@/types/Books"; 
import { BookCopy } from "@/types/BookCopy";
import { RowDataPacket } from "mysql2";

interface RawBookRow extends RowDataPacket {
  id: number;
  title: string;
  author: string;
  description: string;
  year_published: number;
  genres: string | string[] | null;
  copies: string | BookCopy[] | null;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Extract genres and exclude flag from the URL query parameters
    const searchParams = request.nextUrl.searchParams;
    const genresQuery = searchParams.get("genres");
    const exclude = searchParams.get("exclude") === "true";
    
    // Parse the comma-separated string into an array of strings
    const selectedGenres = genresQuery 
      ? genresQuery.split(",").map(g => g.trim()).filter(Boolean) 
      : [];

    // 2. Build the base query using explicit JOINs
    let sqlQuery = `
      SELECT 
          b.id,
          b.title,
          a.name AS author,
          b.description,
          b.published_year AS year_published,
          
          (
              SELECT JSON_ARRAYAGG(g.name)
              FROM book_genres bg
              JOIN genres g ON bg.genre_id = g.id
              WHERE bg.book_id = b.id
          ) AS genres,
          
          (
              SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'id', bc.id,
                      'format', bc.format,
                      'stock', bc.stock,
                      'file_path', bc.file_path,
                      'price', bc.price
                  )
              )
              FROM book_copies bc
              WHERE bc.book_id = b.id
          ) AS copies
          
      FROM books b
      JOIN authors a ON b.author_id = a.id
    `;

    const queryParams: any[] = [];

    // 3. Conditionally append WHERE clause based on inclusion or exclusion
    if (selectedGenres.length > 0) {
      if (exclude) {
        // Selection with NOT: Find books that do NOT have any of the selected genres
        sqlQuery += `
          WHERE NOT EXISTS (
              SELECT 1
              FROM book_genres filter_bg
              JOIN genres filter_g ON filter_bg.genre_id = filter_g.id
              WHERE filter_bg.book_id = b.id 
              AND filter_g.name IN (?)
          )
        `;
        queryParams.push(selectedGenres);
      } else {
        sqlQuery += `
          WHERE (
              SELECT COUNT(DISTINCT filter_g.name) 
              FROM book_genres filter_bg
              JOIN genres filter_g ON filter_bg.genre_id = filter_g.id
              WHERE filter_bg.book_id = b.id 
              AND filter_g.name IN (?)
          ) = ?
        `;
        // Push the array of genres, AND the total number of genres required
        queryParams.push(selectedGenres, selectedGenres.length);
      }
    }

    sqlQuery += ` ORDER BY b.id;`;

    // 4. Execute the dynamically built query
    const [rows] = await database.query<RawBookRow[]>(sqlQuery, queryParams);

    // 5. Parse and map the raw rows to strictly match your Books interface
    const formattedRows: Books[] = rows.map((row) => {
      let parsedGenres: string[] = [];
      if (typeof row.genres === 'string') {
        parsedGenres = JSON.parse(row.genres) || [];
      } else if (Array.isArray(row.genres)) {
        parsedGenres = row.genres;
      }

      let parsedCopies: BookCopy[] = [];
      if (typeof row.copies === 'string') {
        parsedCopies = JSON.parse(row.copies) || [];
      } else if (Array.isArray(row.copies)) {
        parsedCopies = row.copies;
      }

      parsedGenres = parsedGenres.filter(Boolean);
      parsedCopies = parsedCopies.filter((copy) => copy && copy.id !== null);

      return {
        id: row.id,
        title: row.title,
        author: row.author || "Unknown",
        description: row.description,
        year_published: row.year_published,
        genres: parsedGenres,
        copies: parsedCopies,
      };
    });

    return NextResponse.json(formattedRows, { status: 200 });

  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch book catalog" }, 
      { status: 500 }
    );
  }
}