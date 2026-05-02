import Image from "next/image";
import { BorrowedBook } from "@/types/BorrowedBook"; // Adjust import path as needed

interface BorrowedBooksListProps {
  books: BorrowedBook[];
}

export default function BorrowedBooks({ books }: BorrowedBooksListProps) {
  if (books.length === 0) {
    return <p className="text-gray-400 italic">No books currently borrowed.</p>;
  }

  return (
    <div className="grid gap-3">
      {books.map((book) => (
        <div key={book.id} className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm">
          
          {/* Left Side: Image + Details */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-16 sm:w-16 sm:h-24 flex-shrink-0">
              <Image 
                src={`/booksdb/${book.book_id}/cover.jpg`} 
                alt={book.book_title}
                fill
                className="object-cover rounded shadow-sm border border-gray-200"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{book.book_title}</p>
              <p className="text-sm text-gray-500">Format: {book.format}</p>
            </div>
          </div>

          {/* Right Side: Status + Date */}
          <div className="text-right flex-shrink-0">
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
              book.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {book.status}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              Due: {new Date(book.due_date).toLocaleDateString()}
            </p>
          </div>

        </div>
      ))}
    </div>
  );
}