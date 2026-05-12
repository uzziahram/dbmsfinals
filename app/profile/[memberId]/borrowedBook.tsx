"use client"

import Image from "next/image";
import { useState } from "react";
import { BorrowedBook } from "@/types/BorrowedBooks"; // Adjust import path as needed

type BookStatus = "pending" | "borrowed" | "overdue" | "returned";

// 1. Create a sub-component to handle the individual state and API calls
function BorrowedBookItem({ book }: { book: BorrowedBook }) {
  const [status, setStatus] = useState<BookStatus>(book.status as BookStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReturn = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/transactions/borrow_update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId: book.id, status: "returned" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update status");
      }
      setStatus("returned");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusStyles = (currentStatus: string) => {
    switch (currentStatus) {
      case 'overdue': return 'bg-red-600 text-white border-red-700';
      case 'returned': return 'bg-slate-100 text-slate-400 border-slate-200';
      case 'borrowed': return 'bg-blue-600 text-white border-blue-700';
      case 'pending': return 'bg-amber-500 text-white border-amber-600';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="group flex flex-col bg-white border border-slate-200 rounded-none overflow-hidden hover:border-blue-500 transition-all">
      {/* Top: Image */}
      <div className="relative aspect-[2/3] w-full bg-slate-100">
        <Image 
          src={`/booksdb/${book.book_id}/cover.jpg`} 
          alt={book.book_title}
          fill
          sizes="(max-width: 640px) 100vw, 20vw"
          className="object-cover"
        />
        
        {/* Status Overlay */}
        <div className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter border ${getStatusStyles(status)}`}>
          {status}
        </div>
      </div>

      {/* Bottom: Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
          {book.book_title}
        </h3>
        
        <div className="mt-auto pt-3 border-t border-slate-50 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-400 uppercase">Due Date</span>
            <span className={status === 'overdue' ? 'text-red-600' : 'text-slate-900'}>
              {new Date(book.due_date).toLocaleDateString()}
            </span>
          </div>

          {status !== 'returned' && (
            <button
              onClick={handleReturn}
              disabled={isUpdating}
              className="w-full py-2 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-none hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer"
            >
              {isUpdating ? "Processing..." : "Return Book"}
            </button>
          )}

          {status === 'returned' && (
            <div className="w-full py-2 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase rounded-none text-center border border-slate-100">
              Returned
            </div>
          )}
        </div>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {books.map((book) => (
        <BorrowedBookItem key={book.id} book={book} />
      ))}
    </div>
  );
}