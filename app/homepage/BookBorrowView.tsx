"use client"

import { Books } from "@/types/Books"
import { BookCopy } from "@/types/BookCopy"
import { AlertCircle } from "lucide-react"

type Props = {
  book: Books
  selectedCopy: BookCopy | null
  setSelectedCopy: (copy: BookCopy) => void
  isOutOfStock: boolean
  error: string | null
  isSubmitting: boolean
  onBack: () => void
  onSubmit: () => void
}

export function BookBorrowView({
  book,
  selectedCopy,
  setSelectedCopy,
  isOutOfStock,
  error,
  isSubmitting,
  onBack,
  onSubmit,
}: Props) {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300 flex flex-col h-full w-full">
      <div>
        <button 
          onClick={onBack}
          className="text-blue-500 text-sm font-medium mb-4 hover:underline"
        >
          ← Back to details
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Borrow Options</h2>

        {/* Dynamic Format Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">Select Format to Borrow</label>
          <div className="flex gap-4 flex-wrap">
            {book.copies?.map((copy) => (
              <button
                key={copy.id}
                onClick={() => setSelectedCopy(copy)}
                className={`flex-1 min-w-[120px] py-3 border-2 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
                  selectedCopy?.id === copy.id 
                  ? "border-blue-500 bg-blue-50 text-blue-700" 
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <span className="capitalize font-semibold">{copy.format}</span>
                <span className="text-sm">
                  {copy.stock !== null ? (copy.stock > 0 ? `${copy.stock} available` : "Out of stock") : "Available"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-auto pt-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button 
          onClick={onSubmit}
          disabled={isOutOfStock || !selectedCopy || isSubmitting}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg transition flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : isOutOfStock ? (
            "Out of Stock" 
          ) : (
            "Confirm Borrow"
          )}
        </button>
      </div>
    </div>
  )
}