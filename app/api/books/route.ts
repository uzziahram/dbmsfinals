import database from "@/app/lib/database/db";
import { NextResponse } from "next/server";
import { Books } from "@/app/types/Books";
import { RowDataPacket } from "mysql2";

export async function GET() {
  const [rows] = await database.query<(Books & RowDataPacket)[]>(
    "SELECT * FROM members"
  );

  return NextResponse.json(rows);
}