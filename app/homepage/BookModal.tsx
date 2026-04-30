"use client"

import { Books } from "@/types/Books"
import Image from "next/image"

type Props = {
  book: Books
  onClose: () => void
}

export default function BookModal({ book, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
      
      <div className="bg-white rounded-xl shadow-xl relative flex max-w-6xl w-full overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl z-10"
        >
          ✕
        </button>

        {/* LEFT: IMAGE (bigger) */}
        <div className="relative w-[340px] sm:w-[420px] aspect-[2/3] flex-shrink-0">
          <Image
            src={`/booksdb/${book.id}/cover.jpg`}
            alt={book.title}
            fill
            priority={book.id === 1}
            sizes="420px"
            className="object-cover"
          />
        </div>

        {/* RIGHT: DETAILS (bigger) */}
        <div className="p-8 flex flex-col justify-between w-[420px] sm:w-[520px]">
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {book.title}
            </h2>

            <p className="text-sm text-gray-600 mt-2">
              by {book.author}
            </p>

            <p className="mt-5 text-sm text-gray-700 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* BUTTONS */}
         <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button className="w-full sm:flex-1 px-5 py-3 text-sm sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">
              Borrow
            </button>

            <button className="w-full sm:flex-1 px-5 py-3 text-sm sm:text-base bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer">
              Buy
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}