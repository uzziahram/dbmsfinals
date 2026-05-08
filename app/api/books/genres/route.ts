import { NextRequest, NextResponse } from "next/server"
import database from "@/lib/database/db"
import { RowDataPacket } from "mysql2"

// Define the Genre interface based on your ERD
export interface Genre extends RowDataPacket {
  id: number;
  name: string;
}

export async function GET(req: NextRequest) {
  try {
    // Fetch all genres from the 'genres' table
    // We order by name to make the list user-friendly for dropdowns or filters
    const [genres] = await database.query<Genre[]>(
      `SELECT id, name 
       FROM genres 
       ORDER BY name ASC`
    )

    return NextResponse.json(genres, { status: 200 })
    
  } catch (error) {
    console.error("Error fetching all genres:", error)
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500 }
    )
  }
}