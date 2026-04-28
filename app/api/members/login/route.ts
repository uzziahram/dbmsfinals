import database from "@/app/lib/database/db";
import { Member } from "@/app/types/Member";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest ) {
  try {
    const { email , password } = await req.json()

    const [rows] = await database.execute<RowDataPacket[]>(
      "SELECT * FROM members WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }

    const Member = rows[0] as Member;

    if (Member.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    }

        // ✅ create session data
    const sessionData = {
      id: Member.id,
      name: Member.name,
    };

    const response = NextResponse.json({ message: "Login success" })
    

    // 🔐 create a session cookie
    response.cookies.set("session", JSON.stringify(sessionData), {
      httpOnly: true,   // cannot be accessed by JS (more secure)
      secure: false,    // true in production (HTTPS)
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response
    

  } catch (err) {
    return NextResponse.json( { message: "Invalid credentials", status: 401  })
  }
}