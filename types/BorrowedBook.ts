export interface BorrowedBook {
    id: string;
    bookCopyId: string;
    status: "borrowed" | "pending" | "overdue";
    borrowed_at: string;
    due_date: string;
    returned_at: null;
    book_id: string;
    format: "softcopy" | "hardcopy"
}