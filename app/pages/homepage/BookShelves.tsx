"use client"

import { useState, useEffect } from "react"
import { Books } from "@/types/Books"
import BookCard from "./BookCard"

export default function BookShelves() {

  const [books, setBooks] = useState<Books[]>([])

  async function getBooks(): Promise<Books[]> {
    const res = await fetch("/api/books")
    return res.json()
  }

  useEffect(() => {
    getBooks().then(setBooks)
  }, [])

  return (
    <section>
      <h2 style={{ fontSize: "22px", marginBottom: "15px" }}>
        Book shelf
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "20px",
        }}
      >
        {books.map((book: Books) => (
          <BookCard key={book.id} book={book} />
        ))}

      </div>
    </section>
  )
}