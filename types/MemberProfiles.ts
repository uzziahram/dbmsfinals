import { Member } from "./Member"
import { BorrowedBook } from "./BorrowedBooks"
import { PurchasedBook } from "./PurchasedBooks"

export default interface MemberProfile {
    member: Member
    borrowed: BorrowedBook[]
    purchased: PurchasedBook[]
}

//   id: number | string;
//   name: string;
//   username: string;
//   email: string;
//   address: string;
//   created_at: string;
//   password: string;
//   borrowed_Books: [];
//   purchased_Books: [];