"use client"

import { Books } from "@/types/Books"
import Image from "next/image"

type Props = {
  book: Books
  onClose: () => void
}

export default function BookModal({ book, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      
      <div className="bg-white rounded-xl shadow-xl relative flex max-w-4xl w-auto overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl z-10"
        >
          ✕
        </button>

        {/* LEFT: IMAGE */}
        <div className="relative w-[260px] sm:w-[300px] aspect-[2/3] flex-shrink-0">
          <Image
            src={`/booksdb/${book.id}/cover.jpg`}
            alt={book.title}
            fill
            priority={book.id === 1}
            sizes="300px"
            className="object-cover"
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div className="p-6 flex flex-col justify-between w-[320px] sm:w-[380px]">
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {book.title}
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              by {book.author}
            </p>

            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-2">
            <button className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">
              Borrow
            </button>

            <button className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer">
              Buy
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}