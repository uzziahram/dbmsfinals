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
    <div className="animate-in fade-in duration-500 flex flex-col h-full w-full">
      <div className="overflow-y-auto pr-2 max-h-[65vh] space-y-10">
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer relative z-10"
        >
          ← Back to Details
        </button>

        <div className="pt-2">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Borrow Options</h2>
        </div>

        {/* Specimen Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Format</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {book.copies?.map((copy) => (
              <button
                key={copy.id}
                onClick={() => setSelectedCopy(copy)}
                className={`py-4 border-2 rounded-none transition-all flex flex-col items-center justify-center gap-1 ${
                  selectedCopy?.id === copy.id 
                  ? "border-slate-900 bg-slate-900 text-white" 
                  : "border-slate-100 text-slate-500 hover:border-slate-200"
                }`}
              >
                <span className="capitalize font-bold text-sm">{copy.format}</span>
                <span className="text-xs opacity-80">
                  {copy.stock !== null ? (copy.stock > 0 ? `${copy.stock} available` : "Out of stock") : "Available"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Terms Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lending Terms</label>
          <div className="bg-slate-50 p-6 border-l-4 border-slate-900">
            <p className="text-sm font-bold text-slate-700 mb-2">Standard 14-day borrowing period.</p>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              By confirming, you agree to return the book in its current condition.
            </p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-auto pt-8 border-t border-slate-100 bg-white">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Borrowing Fee</span>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Free</span>
          </div>

          <button 
            onClick={onSubmit}
            disabled={isOutOfStock || !selectedCopy || isSubmitting}
            className="px-10 py-4 bg-slate-900 text-white font-bold rounded-none hover:bg-black transition-all"
          >
            {isSubmitting ? "Processing..." : "Confirm Borrow"}
          </button>
        </div>
      </div>
    </div>
  )
}