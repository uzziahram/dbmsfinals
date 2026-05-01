import { BookCopy } from "./BookCopy";

export interface Books {
  id: number | string;
  title: string;
  author: string;
  description: string;
  year_published: number | string;
  genres: string[];
  copies: BookCopy[];
}