import database from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function PATCH(request: NextRequest) {
  try {
    // Parse the incoming JSON payload
    const body = await request.json();
    const { logId, status } = body;

    // 1. Basic Validation
    if (!logId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: 'logId' and 'status' are required." },
        { status: 400 }
      );
    }

    // Validate against your ENUM values
    const allowedStatuses = ['pending', 'borrowed', 'returned', 'overdue'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values are: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // 2. Execute the Database Update
    const query = `
      UPDATE borrow_logs 
      SET 
        status = ?, 
        returned_at = CASE 
                        WHEN ? = 'returned' THEN CURRENT_TIMESTAMP 
                        ELSE returned_at 
                      END
      WHERE id = ?;
    `;

    const [result] = await database.query<ResultSetHeader>(query, [
      status, 
      status, 
      logId
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: `Borrow log with ID ${logId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Status updated successfully", 
        updatedLogId: logId,
        newStatus: status
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Failed to update borrow log status:", error);
    return NextResponse.json(
      { error: "Internal server error while updating status." }, 
      { status: 500 }
    );
  }
}