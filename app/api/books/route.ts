import database from "@/lib/database/db";
import { NextResponse } from "next/server";
import { Books } from "@/types/Books";
import { RowDataPacket } from "mysql2";

export async function GET() {
  const [rows] = await database.query<(Books & RowDataPacket)[]>(`
    SELECT 
      b.id,
      b.title,
      a.name AS author,
      GROUP_CONCAT(g.name SEPARATOR ', ') AS genres,
      b.description,
      b.published_year AS year_published
    FROM books b, authors a, book_genres bg, genres g
    WHERE b.author_id = a.id
      AND b.id = bg.book_id
      AND bg.genre_id = g.id
    GROUP BY b.id, b.title, a.name, b.description, b.published_year;
  `);

  return NextResponse.json(rows);
}




