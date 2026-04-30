export interface PurchasedBook {
    id: string;
    book_copy_id: string;
    book_title: string;
    quantity: number;
    total_price: number;
    payment_amount: number;
    change_amount: number;
    purchased_at: string;
    book_id: string;
    format: "hardcopy";
}