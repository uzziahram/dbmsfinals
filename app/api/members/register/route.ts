import database from "@/app/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: { name: string; email: string ; password: string; address: string} = await req.json();

  const { name, email, password, address} = body;

  await database.query(
    "INSERT INTO members (name, email, password, address) VALUES (?, ?, ?, ?)",
    [name, email, password, address]
  );

  return NextResponse.json({ message: "User added" });
}