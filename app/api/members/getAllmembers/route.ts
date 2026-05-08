import { NextRequest, NextResponse } from "next/server"
import database from "@/lib/database/db"
import { Member } from "@/types/Member"
import { RowDataPacket } from "mysql2"

export async function GET(req: NextRequest) {
  try {
    // Fetch all members, excluding sensitive data like passwords
    const [members] = await database.query<(Member & RowDataPacket)[]>(
      `SELECT id, name, username, email, address, created_at
       FROM members
       ORDER BY created_at DESC`
    )

    // If you want to return an empty array when there are no members, 
    // it will naturally do so since `members` will be []
    return NextResponse.json(members, { status: 200 })
    
  } catch (error) {
    console.error("Error fetching all members:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}