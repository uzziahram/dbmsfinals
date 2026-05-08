"use client"

import { useState, useEffect, useRef } from "react"
import { Books } from "@/types/Books"
import BookCard from "./BookCard"
import BookModal from "./BookModal"

interface BookShelvesProps {
  memberId: string;
}

export default function BookShelves({ memberId }: BookShelvesProps) {
  const [books, setBooks] = useState<Books[]>([])
  const [selectedBook, setSelectedBook] = useState<Books | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [availableGenres, setAvailableGenres] = useState<string[]>([])
  
  // New state to manage dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function getGenres(): Promise<string[]> {
    try {
      const res = await fetch("/api/books/genres")
      if (!res.ok) throw new Error("Failed to fetch genres")
      const data = await res.json()
      
      return data.map((genre: { id: number; name: string }) => genre.name)
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async function getBooks(genres: string[]): Promise<Books[]> {
    try {
      let url = "/api/books"
      if (genres.length > 0) {
        const params = new URLSearchParams({ genres: genres.join(",") })
        url = `/api/books/genresFilter?${params.toString()}`
      }
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch books")
      return res.json()
    } catch (error) {
      console.error(error)
      return []
    }
  }

  useEffect(() => {
    getGenres().then((data) => setAvailableGenres(data))
  }, [])

  useEffect(() => {
    setIsLoading(true)
    getBooks(selectedGenres).then((data) => {
      setBooks(data)
      setIsLoading(false)
    })
  }, [selectedGenres])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => 
      prev.includes(genre) 
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    )
  }

  return (
    <section>
      {availableGenres.length > 0 && (
        <div className="mb-6 relative w-72" ref={dropdownRef}>
          {/* Dropdown Toggle Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex justify-between items-center px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <span>
              {selectedGenres.length === 0
                ? "Filter by Genre..."
                : `${selectedGenres.length} genre${selectedGenres.length > 1 ? 's' : ''} selected`}
            </span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <ul className="py-2">
                {availableGenres.map((genre) => (
                  <li
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        readOnly
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 pointer-events-none"
                      />
                    </div>
                    <span className={`text-sm ${selectedGenres.includes(genre) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {genre}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <p className="text-center py-10">Loading library...</p>
      ) : books.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No books found for the selected genres.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      )}

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          memberId={memberId} 
        />
      )}
    </section>
  )
}