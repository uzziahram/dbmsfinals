import Image from "next/image";
import { PurchasedBook } from "@/types/PurchasedBook";

interface PurchasedBooksProps {
  books: PurchasedBook[];
}

export default function PurchasedBooks({ books }: PurchasedBooksProps) {
  if (!books || books.length === 0) {
    return <p className="text-gray-400 italic">No purchase history available.</p>;
  }

  return (
    <div className="grid gap-3">
      {books.map((item) => (
        <div key={item.id} className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm">
          
          {/* Left Side: Image + Details */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-16 sm:w-16 sm:h-24 flex-shrink-0">
              <Image 
                src={`/booksdb/${item.book_id}/cover.jpg`} 
                alt={item.book_title}
                fill
                className="object-cover rounded shadow-sm border border-gray-200"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{item.book_title}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity} • {item.format}</p>
            </div>
          </div>

          {/* Right Side: Price + Date */}
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-green-600">₱{item.total_price.toFixed(2)}</p>
            <p className="text-xs text-gray-400">{new Date(item.purchased_at).toLocaleDateString()}</p>
          </div>

        </div>
      ))}
    </div>
  );
}