import database from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: { name: string; email: string; username: string ; password: string; address: string} = await req.json();

  const { name, email, username,  password, address} = body;

  await database.query(
    "INSERT INTO members (name, username, email, password, address) VALUES (?, ?, ?, ?, ?)",
    [name,username,  email, password, address]
  );

  return NextResponse.json({ message: "User added" });
}