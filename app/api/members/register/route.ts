import database from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: { name: string; email: string; username: string ; password: string; address: string} = await req.json();
    const { name, email, username, password, address} = body;

    await database.query(
      "INSERT INTO members (name, username, email, password, address) VALUES (?, ?, ?, ?, ?)",
      [name, username, email, password, address]
    );

    return NextResponse.json({ message: "User added" });
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Check for MySQL duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { message: "This email or username is already registered. Please use another or sign in." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
