import { Books } from "@/types/Books"

type BookDetailsViewProps = {
  book: Books
  hasCopies: boolean
  onBorrow: () => void
  onPurchase: () => void
}

export function BookDetails({ book, hasCopies, onBorrow, onPurchase }: BookDetailsViewProps) {
  return (
    <div className="animate-in fade-in duration-300 w-full h-full flex flex-col">
      {/* Top Content: Title, Author, Description */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{book.title}</h2>
        <p className="text-sm text-gray-600 mt-2">by {book.author}</p>
        <p className="mt-5 text-sm text-gray-700 leading-relaxed">
          {book.description}
        </p>
      </div>

      {/* Bottom Content: Buttons */}
      <div className="mt-auto pt-8 flex flex-row gap-4 w-full">
        <button
          onClick={onBorrow}
          disabled={!hasCopies}
          className={`cursor-pointer flex-1 py-4 font-bold rounded-lg transition flex items-center justify-center ${
            hasCopies
              ? "bg-blue-50 text-blue-700 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
              : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
          }`}
        >
          {hasCopies ? "Borrow" : "Unavailable"}
        </button>

        <button
          onClick={onPurchase}
          disabled={!hasCopies}
          className={`cursor-pointer flex-1 py-4 text-white font-bold rounded-lg transition flex items-center justify-center shadow-lg ${
            hasCopies
              ? "bg-green-600 shadow-green-200 hover:bg-green-700"
              : "bg-gray-400 shadow-none cursor-not-allowed"
          }`}
        >
          {hasCopies ? "Buy Now" : "Unavailable"}
        </button>
      </div>
    </div>
  )
}