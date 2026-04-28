"use client"

import type { Books } from "@/types/Books"

type Props = {
  book: Books
}

export default function BookCard({ book }: Props) {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white w-full">
      <h2 className="text-lg font-semibold">{book.title}</h2>

      <p className="text-sm text-gray-600 mt-1">
        Author: <span className="font-medium">{book.author}</span>
      </p>

      <p className="text-sm text-gray-600">
        Genre: {book.genres}
      </p>

      <p className="text-sm text-gray-600">
        Year: {book.year_published}
      </p>

      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
        {book.description}
      </p>

      <div className="mt-4 flex gap-2">
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Borrow
        </button>

        <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">
          Buy
        </button>
      </div>
    </div>
  )
}