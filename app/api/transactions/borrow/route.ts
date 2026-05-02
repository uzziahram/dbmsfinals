import { NextResponse } from "next/server";
import database from "@/lib/database/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { member_id, book_copy_id, due_date, max_extensions = 0 } = body;

    if (!member_id || !book_copy_id) {
      return NextResponse.json({ error: 'member_id and book_copy_id are required' }, { status: 400 });
    }

    // --- LOGIC FOR DEFAULT DUE DATE ---
    // If no due_date is provided, calculate 14 days from now
    const calculatedDueDate = due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const connection = await database.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Check if the book copy exists and is available
      const [copyRows] = await connection.query<RowDataPacket[]>(
        'SELECT format, stock FROM book_copies WHERE id = ? FOR UPDATE', // Added FOR UPDATE to prevent race conditions
        [book_copy_id]
      );

      if (copyRows.length === 0) {
        throw new Error('Book copy not found');
      }

      const bookCopy = copyRows[0];

      if (bookCopy.format === 'hardcopy' && bookCopy.stock <= 0) {
        throw new Error('This hardcopy is currently out of stock');
      }

      // --- NEW LOGIC: DETERMINE INITIAL STATUS based on format ---
      const initialStatus = bookCopy.format === 'softcopy' ? 'borrowed' : 'pending';

      // 2. Insert into borrow_logs (now including status)
      const [insertResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO borrow_logs (member_id, book_copy_id, max_extensions, due_date, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [member_id, book_copy_id, max_extensions, calculatedDueDate, initialStatus]
      );

      // 3. Decrement stock if it's a hardcopy
      if (bookCopy.format === 'hardcopy') {
        const [updateResult] = await connection.query<ResultSetHeader>(
          'UPDATE book_copies SET stock = stock - 1 WHERE id = ? AND stock > 0',
          [book_copy_id]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error('Failed to update stock. It may have just run out.');
        }
      }

      await connection.commit();
      connection.release();

      return NextResponse.json({ 
        success: true, 
        message: 'Borrow request created successfully',
        borrow_id: insertResult.insertId,
        status: initialStatus // Optional: Returning the status to the client
      }, { status: 201 });

    } catch (error: any) {
      await connection.rollback();
      connection.release();
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to process borrow request' }, { status: 500 });
  }
}