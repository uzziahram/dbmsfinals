"use client"

import Image from "next/image";
import { useState } from "react";
import { BorrowedBook } from "@/types/BorrowedBooks"; // Adjust import path as needed

type BookStatus = "pending" | "borrowed" | "overdue" | "returned";

// 1. Create a sub-component to handle the individual state and API calls
function BorrowedBookItem({ book }: { book: BorrowedBook }) {
  const [status, setStatus] = useState<BookStatus>(book.status as BookStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    // 2. Cast the event value to your specific BookStatus type
    const newStatus = e.target.value as BookStatus;
    
    setIsUpdating(true);

    try {
      const res = await fetch("/api/transactions/borrow_update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logId: book.id, status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      // 3. Now TypeScript is happy because newStatus is strictly a BookStatus
      setStatus(newStatus);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper function to determine badge styling based on status
  const getStatusStyles = (currentStatus: string) => {
    switch (currentStatus) {
      case 'overdue': return 'bg-red-100 text-red-600 border-red-200';
      case 'returned': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'borrowed': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm">
      
      {/* Left Side: Image + Details */}
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-16 sm:w-16 sm:h-24 flex-shrink-0">
          <Image 
            src={`/booksdb/${book.book_id}/cover.jpg`} 
            alt={book.book_title}
            fill
            sizes="(max-width: 640px) 48px, 64px"
            className="object-cover rounded shadow-sm border border-gray-200"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{book.book_title}</p>
          <p className="text-sm text-gray-500">Format: {book.format}</p>
        </div>
      </div>

      {/* Right Side: Status + Date */}
      <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
        {status === 'returned' ? (
          // Unclickable span if returned
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getStatusStyles(status)}`}>
            {status}
          </span>
        ) : (
          // Select dropdown for active statuses
          <select 
            value={status}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className={`px-2 py-1 rounded text-xs font-bold uppercase border cursor-pointer outline-none transition-opacity ${getStatusStyles(status)} ${isUpdating ? 'opacity-50' : 'hover:brightness-95'}`}
          >
            <option value="borrowed">Borrowed</option>
            {/* CONDITIONAL RENDER: Only show the "Overdue" option if the book is currently overdue */}
            {status === "overdue" && <option value="overdue">Overdue</option>}
            <option value="returned">Returned</option>
          </select>
        )}
        
        <p className="text-xs text-gray-400 mt-1">
          Due: {new Date(book.due_date).toLocaleDateString()}
        </p>
      </div>

    </div>
  );
}

// 2. Main Component
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
        <BorrowedBookItem key={book.id} book={book} />
      ))}
    </div>
  );
}