import { Books } from "@/types/Books"
import { Calendar, User as UserIcon, BookOpen } from "lucide-react"

type BookDetailsViewProps = {
  book: Books
  hasCopies: boolean
  onBorrow: () => void
  onPurchase: () => void
}

export function BookDetails({ book, hasCopies, onBorrow, onPurchase }: BookDetailsViewProps) {
  return (
    <div className="animate-in fade-in duration-700 w-full h-full flex flex-col">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Work ID: {String(book.id).padStart(4, '0')}
        </span>
        <div className="flex gap-2">
          {book.genres?.slice(0, 3).map((genre, index) => (
            <span key={index} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 uppercase">
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Title & Author */}
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-2">
          {book.title}
        </h2>
        <p className="text-lg text-slate-500 font-medium">by <span className="text-slate-900">{book.author}</span></p>
      </div>

      {/* Description */}
      <div className="mb-10">
        <p className="text-lg text-slate-600 leading-relaxed italic">
          &ldquo;{book.description}&rdquo;
        </p>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-8 mb-12 py-6 border-y border-slate-50">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Published</span>
          <span className="font-bold text-slate-700">{book.year_published}</span>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Status</span>
          <span className={`font-bold ${hasCopies ? "text-green-600" : "text-red-500"}`}>
            {hasCopies ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onBorrow}
          disabled={!hasCopies}
          className={`py-4 px-6 font-bold uppercase text-xs transition-all flex items-center justify-center gap-2 border-2 ${
            hasCopies
              ? "bg-white text-slate-900 border-slate-900 hover:bg-slate-900 hover:text-white"
              : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {hasCopies ? "Borrow Book" : "Unavailable"}
        </button>

        <button
          onClick={onPurchase}
          disabled={!hasCopies}
          className={`py-4 px-6 font-bold uppercase text-xs transition-all flex items-center justify-center active:scale-[0.98] ${
            hasCopies
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {hasCopies ? "Buy Book" : "Out of Stock"}
        </button>
      </div>
    </div>
  )
}
