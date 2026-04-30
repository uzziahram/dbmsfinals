import { NextRequest, NextResponse } from "next/server"
import database from "@/lib/database/db"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id }= await params

    // 🔹 1. Get member info
    const [memberRows]: any = await database.query(
      `SELECT id, name, username, email, address, created_at
       FROM members
       WHERE id = ?`,
      [id]
    )

    if (memberRows.length === 0) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 })
    }

    const member = memberRows[0]

    // 🔹 2. Get borrowed logs
    const [borrowedRows]: any = await database.query(
      `SELECT 
          bl.id,
          bl.book_copy_id,
          bl.status,
          bl.borrowed_at,
          bl.due_date,
          bl.returned_at,
          bc.book_id,
          bc.format
       FROM borrow_logs bl
       JOIN book_copies bc ON bl.book_copy_id = bc.id
       WHERE bl.member_id = ?`,
      [id]
    )

    // 🔹 3. Get purchase logs
    const [purchaseRows]: any = await database.query(
      `SELECT 
          pl.id,
          pl.book_copy_id,
          pl.quantity,
          pl.total_price,
          pl.payment_amount,
          pl.change_amount,
          pl.purchased_at,
          bc.book_id,
          bc.format
       FROM purchase_logs pl
       JOIN book_copies bc ON pl.book_copy_id = bc.id
       WHERE pl.member_id = ?`,
      [id]
    )

    return NextResponse.json({
      member,
      borrowed: borrowedRows,
      purchased: purchaseRows,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}