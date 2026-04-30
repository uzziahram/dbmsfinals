import { NextRequest, NextResponse } from "next/server"
import database from "@/lib/database/db"
import { Member } from "@/types/Member"
import { BorrowedBook } from "@/types/BorrowedBook"
import { PurchasedBook } from "@/types/PurchasedBook"
import { RowDataPacket } from "mysql2"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params

    // 1. Get member info first (so we can early-return if not found)
    const [memberRows] = await database.query<(Member & RowDataPacket)[]>(
      `SELECT id, name, username, email, address, created_at
       FROM members
       WHERE id = ?`,
      [id]
    )

    if (memberRows.length === 0) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 })
    }

    const member = memberRows[0]

    // 2. Run borrowed logs and purchase logs concurrently for better performance
    const borrowedPromise = database.query<(BorrowedBook & RowDataPacket)[]>(
      `SELECT 
          bl.id,
          bl.book_copy_id,
          bl.status,
          bl.borrowed_at,
          bl.due_date,
          bl.returned_at,
          bc.book_id,
          bc.format,
          b.title AS book_title
       FROM borrow_logs bl
       JOIN book_copies bc ON bl.book_copy_id = bc.id
       JOIN books b ON bc.book_id = b.id
       WHERE bl.member_id = ?`,
      [id]
    )

    const purchasePromise = database.query<(PurchasedBook & RowDataPacket)[]>(
      `SELECT 
          pl.id,
          pl.book_copy_id,
          pl.quantity,
          pl.total_price,
          pl.payment_amount,
          pl.change_amount,
          pl.purchased_at,
          bc.book_id,
          bc.format,
          b.title AS book_title
       FROM purchase_logs pl
       JOIN book_copies bc ON pl.book_copy_id = bc.id
       JOIN books b ON bc.book_id = b.id
       WHERE pl.member_id = ?`,
      [id]
    )

    // Await both queries at the same time
    const [[borrowedRows], [purchaseRows]] = await Promise.all([
      borrowedPromise, 
      purchasePromise
    ])

    return NextResponse.json({
      member,
      borrowed: borrowedRows,
      purchased: purchaseRows,
    })
  } catch (error) {
    console.error("Error fetching member profile:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}