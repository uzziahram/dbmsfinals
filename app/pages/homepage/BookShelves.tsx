"use client"

import { useState, useEffect } from "react"
import { Books } from "@/types/Books"
import BookCard from "./BookCard"
import BookModal from "./BookModal"

export default function BookShelves() {
  const [books, setBooks] = useState<Books[]>([])
  const [selectedBook, setSelectedBook] = useState<Books | null>(null)

  async function getBooks(): Promise<Books[]> {
    const res = await fetch("/api/books")
    return res.json()
  }

  useEffect(() => {
    getBooks().then(setBooks)
  }, [])

  return (
    <section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 auto-rows-fr">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => setSelectedBook(book)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}

    </section>
  )
}