"use client"

import { useState, useEffect } from "react"
import { Books } from "@/types/Books"
import BookCard from "./BookCard"
import BookModal from "./BookModal"

// 1. Define the props interface
interface BookShelvesProps {
  memberId: string; // Use 'string' if your Payload type defines memberId as a string
}

// 2. Destructure memberId from the props
export default function BookShelves({ memberId }: BookShelvesProps) {
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
            onClick={() => setSelectedBook(book)}
          />
        ))}
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          // 3. Pass it to the modal so your purchase function can use it
          memberId={memberId} 
        />
      )}
    </section>
  )
}