import { NextResponse } from "next/server";
import database from "@/lib/database/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function POST(request: Request) {
  let connection;

  try {
    const body = await request.json();
    
    const { member_id, book_copy_id, quantity, payment_amount } = body;

    // 1. Basic validation
    if (!member_id || !book_copy_id || !quantity || payment_amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    connection = await database.getConnection();
    await connection.beginTransaction();

    const [copies] = await connection.execute<RowDataPacket[]>(
      `SELECT format, stock, price FROM book_copies WHERE id = ? FOR UPDATE`,
      [book_copy_id]
    );

    if (copies.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: "Book copy not found" }, { status: 404 });
    }

    const bookCopy = copies[0];

    // 4. Calculate total price server-side (Unit Price * Quantity)
    const calculated_total_price = Number(bookCopy.price) * quantity;

    // 5. Verify payment amount against the server-calculated total
    if (payment_amount < calculated_total_price) {
      await connection.rollback();
      return NextResponse.json(
        { 
          error: "Insufficient payment", 
          required_amount: calculated_total_price,
          provided_amount: payment_amount
        },
        { status: 400 }
      );
    }

    // Calculate change. Using toFixed(2) to prevent JavaScript floating-point errors (e.g., 21.18 - 20.00 = 1.1799999999999997)
    const raw_change = payment_amount - calculated_total_price;
    const change_amount = Number(raw_change.toFixed(2));

    // 6. Check and deduct stock (only for hardcopies)
    if (bookCopy.format === 'hardcopy') {
      if (bookCopy.stock < quantity) {
        await connection.rollback();
        return NextResponse.json(
          { error: "Insufficient stock available" },
          { status: 409 }
        );
      }

      await connection.execute(
        `UPDATE book_copies SET stock = stock - ? WHERE id = ?`,
        [quantity, book_copy_id]
      );
    }

    // 7. Create the purchase log using the server-calculated price
    const [insertResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO purchase_logs 
        (member_id, book_copy_id, quantity, total_price, payment_amount, change_amount) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [member_id, book_copy_id, quantity, calculated_total_price, payment_amount, change_amount]
    );

    // 8. Commit the transaction
    await connection.commit();

    return NextResponse.json(
      { 
        message: "Purchase successful", 
        purchase_id: insertResult.insertId,
        total_price: calculated_total_price,
        change_amount: change_amount 
      },
      { status: 201 }
    );

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the purchase" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}