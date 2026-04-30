export interface PurchasedBook {
    id: string;
    book_copy_id: string;
    quantity: string;
    total_price: string;
    payment_amount: string;
    change_amount: string;
    purchased_at: string;
    book_id: string;
    format: "softcopy" | "hardcopy";
}