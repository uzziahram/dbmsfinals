"use client"

import { useState, useEffect } from "react"
import { Books } from "@/types/Books"
import BookCard from "./BookCard"
import BookModal from "./BookModal"

export default function BookShelves() {
  const [books, setBooks] = useState<Books[]>([])
  const [selectedBook, setSelectedBook] = useState<Books | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function getBooks(): Promise<Books[]> {
    try {
      const res = await fetch("/api/books")
      if (!res.ok) throw new Error("Failed to fetch books")
      return res.json()
    } catch (error) {
      console.error(error)
      return []
    }
  }

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) return <p className="text-center py-10">Loading library...</p>

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            // Passes the whole book object, including the new "copies" array
            onClick={() => setSelectedBook(book)}
          />
        ))}
      </div>

      {/* Modal - will now have access to selectedBook.copies */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </section>
  )
}