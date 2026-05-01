import database from "@/lib/database/db";
import { NextResponse } from "next/server";
import { Books } from "@/types/Books"; // Adjust import path if needed
import { BookCopy } from "@/types/BookCopy";
import { RowDataPacket } from "mysql2";

// Define the shape of the raw row coming back from MySQL
interface RawBookRow extends RowDataPacket {
  id: number;
  title: string;
  author: string;
  description: string;
  year_published: number;
  genres: string | string[] | null;
  copies: string | BookCopy[] | null;
}

export async function GET() {
  try {
    const [rows] = await database.query<RawBookRow[]>(`
      SELECT 
          b.id,
          b.title,
          a.name AS author,
          b.description,
          b.published_year AS year_published,
          
          -- Subquery for Genres array
          (
              SELECT JSON_ARRAYAGG(g.name)
              FROM book_genres bg
              JOIN genres g ON bg.genre_id = g.id
              WHERE bg.book_id = b.id
          ) AS genres,
          
          -- Subquery for Copies array of objects
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
      LEFT JOIN authors a ON b.author_id = a.id
      ORDER BY b.id;
    `);

    // Parse and map the raw rows to strictly match your Books interface
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

      // MySQL JSON_ARRAYAGG sometimes returns [null] or [{id: null,...}] when there are no matches.
      // This filters out those ghost records to ensure strict array compliance.
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