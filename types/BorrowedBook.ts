export interface BorrowedBook {
    id: string;
    book_copy_id: string;
    status: "borrowed" | "pending" | "overdue";
    borrowed_at: string;
    due_date: string;
    returned_at: string | null;
    book_id: string;
    format: "softcopy" | "hardcopy"
}