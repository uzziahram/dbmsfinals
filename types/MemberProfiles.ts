import { Member } from "./Member"

export default interface MemberProfile {
    member: Member
    borrowed: []
    purchased: []
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