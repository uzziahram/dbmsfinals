import database from "@/app/lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { Member } from "@/app/types/Member";
import { RowDataPacket } from "mysql2";

export async function GET() {
  const [rows] = await database.query<(Member & RowDataPacket)[]>(
    "SELECT * FROM Members"
  );

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body: { name: string; email: string } = await req.json();

  const { name, email } = body;

  await database.query(
    "INSERT INTO Members (name, email) VALUES (?, ?)",
    [name, email]
  );

  return NextResponse.json({ message: "User added" });
}