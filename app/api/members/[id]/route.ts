import { NextRequest, NextResponse } from "next/server"
import database from "@/lib/database/db"
import { Member } from "@/types/Member"
import { BorrowedBook } from "@/types/BorrowedBooks"
import { PurchasedBook } from "@/types/PurchasedBooks"
import { RowDataPacket } from "mysql2"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params

    // Get member info first (so we can early-return if not found)
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

    // 2. Run borrowed logs, purchase logs, and UNIFIED history concurrently
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
       WHERE bl.member_id = ?
       ORDER BY bl.borrowed_at DESC`,
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
       WHERE pl.member_id = ?
       ORDER BY pl.purchased_at DESC`,
      [id]
    )

    // UNION Query for Unified History
    const historyPromise = database.query<RowDataPacket[]>(
      `(SELECT 
          'BORROW' as activity_type,
          b.title as book_title,
          bc.format,
          bl.borrowed_at as activity_date,
          bl.status as detail
        FROM borrow_logs bl
        JOIN book_copies bc ON bl.book_copy_id = bc.id
        JOIN books b ON bc.book_id = b.id
        WHERE bl.member_id = ?)
       UNION
       (SELECT 
          'PURCHASE' as activity_type,
          b.title as book_title,
          bc.format,
          pl.purchased_at as activity_date,
          CONCAT('Qty: ', pl.quantity) as detail
        FROM purchase_logs pl
        JOIN book_copies bc ON pl.book_copy_id = bc.id
        JOIN books b ON bc.book_id = b.id
        WHERE pl.member_id = ?)
       ORDER BY activity_date DESC`,
      [id, id]
    )

    // Await all queries
    const [[borrowedRows], [purchaseRows], [historyRows]] = await Promise.all([
      borrowedPromise, 
      purchasePromise,
      historyPromise
    ])

    return NextResponse.json({
      member,
      borrowed: borrowedRows,
      purchased: purchaseRows,
      history: historyRows
    })
  } catch (error) {
    console.error("Error fetching member profile:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}