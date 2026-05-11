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
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full h-full flex flex-col">
      {/* Genre Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {book.genres?.map((genre, index) => (
          <span
            key={index}
            className="text-[10px] uppercase tracking-widest font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100"
          >
            {genre}
          </span>
        ))}
      </div>

      {/* Top Content: Title, Author, Description */}
      <div>
        <h2 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight">{book.title}</h2>
        
        <div className="flex items-center gap-6 mt-4 text-slate-500">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">{book.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-semibold">{book.year_published}</span>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full my-8" />

        <p className="text-slate-600 leading-relaxed text-lg font-light italic">
          "{book.description}"
        </p>
      </div>

      {/* Bottom Content: Buttons */}
      <div className="mt-auto pt-10 flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={onBorrow}
          disabled={!hasCopies}
          className={`group flex-1 py-4 px-6 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border-2 ${
            hasCopies
              ? "bg-white text-blue-600 border-blue-600 hover:bg-blue-50 active:scale-[0.98]"
              : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
          }`}
        >
          <BookOpen className={`w-5 h-5 ${hasCopies ? "text-blue-600" : "text-slate-400"}`} />
          {hasCopies ? "Borrow Copy" : "Out of Stock"}
        </button>

        <button
          onClick={onPurchase}
          disabled={!hasCopies}
          className={`flex-1 py-4 px-6 font-bold rounded-2xl transition-all flex items-center justify-center shadow-xl active:scale-[0.98] ${
            hasCopies
              ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
              : "bg-slate-400 text-white shadow-none cursor-not-allowed"
          }`}
        >
          {hasCopies ? "Buy Now" : "Unavailable"}
        </button>
      </div>
    </div>
  )
}
