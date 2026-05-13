import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/database/db";
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

/**
 * GET handler for books catalog.
 * Supports 'notBorrowed' filter (DIFFERENCE requirement).
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const notBorrowed = searchParams.get("notBorrowed") === "true";
    const memberId = searchParams.get("memberId");

    let sqlQuery = `
      SELECT 
          b.id,
          b.title,
          a.name AS author,
          b.description,
          b.published_year AS year_published,
          
          (
              SELECT JSON_ARRAYAGG(g.name)
              FROM book_genres bg, genres g
              WHERE bg.book_id = b.id AND bg.genre_id = g.id
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
          
      FROM books b, authors a
      WHERE b.author_id = a.id
    `;

    const queryParams: any[] = [];

    if (notBorrowed && memberId) {
      // DIFFERENCE: [All Books] - [Books User has Borrowed]
      sqlQuery += `
        AND b.id NOT IN (
            SELECT bc.book_id 
            FROM borrow_logs bl
            JOIN book_copies bc ON bl.book_copy_id = bc.id
            WHERE bl.member_id = ?
        )
      `;
      queryParams.push(memberId);
    }

    sqlQuery += ` ORDER BY b.id;`;

    const [rows] = await database.query<RawBookRow[]>(sqlQuery, queryParams);

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
