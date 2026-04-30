"use client"

import type { Books } from "@/types/Books"
import Image from "next/image"

type Props = {
  book: Books
  onClick: () => void
}

export default function BookCard({ book, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col h-full cursor-pointer"
    >
      {/* Image wrapper (forces uniform size) */}
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
        <Image
          src={`/booksdb/${book.id}/cover.jpg`}
          alt={book.title}
          fill
          priority={book.id === 1}
          sizes="(max-width: 640px) 50vw, 
                (max-width: 1024px) 33vw, 
                20vw"
          className="object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition mt-3">
        {book.title}
      </h2>

      {/* Author */}
      <p className="text-sm text-gray-500 mt-1">
        by <span className="font-medium text-gray-700">{book.author}</span>
      </p>

      {/* Genre */}
      <div className="mt-2 flex flex-wrap gap-2">
        {book.genres.map((genre, index) => (
          <span
            key={index}
            className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-200 transition"
          >
            {genre}
          </span>
        ))}
      </div>

      {/* Year */}
      <p className="text-xs text-gray-400 mt-1">
        Published: {book.year_published}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
        {book.description}
      </p>
    </div>
  )
}