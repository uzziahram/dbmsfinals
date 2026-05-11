"use client"

import type { Books } from "@/types/Books"
import Image from "next/image"
import { Calendar } from "lucide-react"

type Props = {
  book: Books
  onClick: () => void
}

export default function BookCard({ book, onClick }: Props) {
  const displayPrice = book.copies?.[0]?.price

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Image wrapper */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-100">
        <Image
          src={`/booksdb/${book.id}/cover.jpg`}
          alt={book.title}
          fill
          priority={book.id === 1 || book.id === "1"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info wrapper */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          {/* Title */}
          <h2 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors leading-tight">
            {book.title}
          </h2>

          {/* Author */}
          <p className="text-sm text-slate-500 mt-1 font-medium italic">
            by {book.author}
          </p>

          {/* Genre Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {book.genres?.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
              >
                {genre}
              </span>
            ))}
            {book.genres && book.genres.length > 2 && (
              <span className="text-[10px] font-bold text-slate-400 self-center">
                +{book.genres.length - 2}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{book.year_published}</span>
            </div>
          </div>
          
          {displayPrice !== undefined && displayPrice !== null && (
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs font-bold text-blue-600">$</span>
              <span className="text-lg font-black text-blue-600 tracking-tighter">
                {displayPrice}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
