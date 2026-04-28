//DEV
import database from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { Member } from "@/types/Member";
import { RowDataPacket } from "mysql2";

export async function GET() {
  const [rows] = await database.query<(Member & RowDataPacket)[]>(
    "SELECT * FROM members"
  );

  return NextResponse.json(rows);
}