"use client"

import type { Books } from "@/types/Books"
import Image from "next/image"

type Props = {
  book: Books
  onClick: () => void
}

export default function BookCard({ book, onClick }: Props) {
  // 1. Simplify formats extraction
  const availableFormats = Array.from(new Set(book.copies?.map((copy) => copy.format) || []))
  
  // 2. Simply use the first available price instead of calculating the minimum
  const displayPrice = book.copies?.[0]?.price

  return (
    <div
      onClick={onClick}
      className="group bg-white shadow-md hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col h-full cursor-pointer overflow-hidden rounded-lg"
    >
      {/* Image wrapper */}
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <Image
          src={`/booksdb/${book.id}/cover.jpg`}
          alt={book.title}
          fill
          priority={book.id === 1 || book.id === "1"}
          sizes="(max-width: 640px) 50vw, 
                (max-width: 1024px) 33vw, 
                20vw"
          className="object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Info wrapper */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
          {book.title}
        </h2>

        {/* Author */}
        <p className="text-sm text-gray-500 mt-1">
          by <span className="font-medium text-gray-700">{book.author}</span>
        </p>

        {/* Genre */}
        <div className="mt-3 flex flex-wrap gap-2">
          {book.genres?.map((genre, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-200 transition"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Year */}
        <p className="text-xs text-gray-400 mt-3">
          Published: {book.year_published}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {book.description}
        </p>

        {/* Simplified: Copies Data (Formats & Pricing) */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex gap-1 text-xs text-gray-500 capitalize">
            {availableFormats.length > 0 ? availableFormats.join(" • ") : "No copies available"}
          </div>
          
          {/* Renders the price only if a valid price exists on the first copy */}
          {displayPrice !== undefined && displayPrice !== null && (
            <span className="font-semibold text-blue-600">
              ${displayPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}