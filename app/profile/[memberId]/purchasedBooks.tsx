import Image from "next/image";
import { PurchasedBook } from "@/types/PurchasedBooks";

interface PurchasedBooksProps {
  books: PurchasedBook[];
}

export default function PurchasedBooks({ books }: PurchasedBooksProps) {
  if (!books || books.length === 0) {
    return <p className="text-gray-400 italic">No purchase history available.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {books.map((item) => (
        <div key={item.id} className="group flex flex-col bg-white border border-slate-200 rounded-none overflow-hidden hover:border-blue-500 transition-all">
          {/* Top: Image */}
          <div className="relative aspect-[2/3] w-full bg-slate-100">
            <Image 
              src={`/booksdb/${item.book_id}/cover.jpg`} 
              alt={item.book_title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-tighter">
              Purchased
            </div>
          </div>

          {/* Bottom: Info */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
              {item.book_title}
            </h3>
            
            <div className="mt-auto pt-3 border-t border-slate-50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.format}</span>
                <span className="font-black text-slate-900 text-xs">₱{item.total_price.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{new Date(item.purchased_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}