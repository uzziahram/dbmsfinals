"use client"

import { useState, useEffect, useRef } from "react"
import { Books } from "@/types/Books"
import BookCard from "./BookCard"
import BookModal from "./BookModal"
import { Search, ChevronDown, Filter } from "lucide-react"

interface BookShelvesProps {
  memberId: string;
}

export default function BookShelves({ memberId }: BookShelvesProps) {
  const [books, setBooks] = useState<Books[]>([])
  const [selectedBook, setSelectedBook] = useState<Books | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [availableGenres, setAvailableGenres] = useState<string[]>([])
  
  // Search states
  const [searchInput, setSearchInput] = useState("") 
  const [activeQuery, setActiveQuery] = useState("") 
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle closing the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch available genres
  async function getGenres(): Promise<string[]> {
    try {
      const res = await fetch("/api/books/genres")
      if (!res.ok) throw new Error("Failed to fetch genres")
      const data = await res.json()
      return data.map((genre: { id: number; name: string }) => genre.name)
    } catch (error) {
      console.error("Genre fetch error:", error)
      return []
    }
  }

  async function getBooks(genres: string[], query: string, signal?: AbortSignal): Promise<Books[]> {
    try {
      let url = "/api/books"
      
      if (query.trim() !== "") {
        url = `/api/books/search?query=${encodeURIComponent(query)}`
      } 
      else if (genres.length > 0) {
        const params = new URLSearchParams({ genres: genres.join(",") })
        url = `/api/books/genresFilter?${params.toString()}`
      }
      
      const res = await fetch(url, { signal })
      if (!res.ok) throw new Error("Failed to fetch books")
      return await res.json()
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Book fetch error:", error)
      }
      return []
    }
  }

  useEffect(() => {
    getGenres().then((data) => setAvailableGenres(data))
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true
    
    setIsLoading(true)
    
    getBooks(selectedGenres, activeQuery, controller.signal).then((data) => {
      if (isActive) {
        setBooks(data)
        setIsLoading(false)
      }
    })

    return () => {
      isActive = false
      controller.abort()
    }
  }, [selectedGenres, activeQuery])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => 
      prev.includes(genre) 
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    )
    setSearchInput("")
    setActiveQuery("")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveQuery(searchInput)
    setSelectedGenres([])
  }

  return (
    <section>
      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex w-full md:max-w-md gap-2">
          <div className="relative flex-grow group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-sm text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* Genre Dropdown */}
        {availableGenres.length > 0 && (
          <div className="relative w-full md:w-64" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex justify-between items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="truncate">
                  {selectedGenres.length === 0
                    ? "All Genres"
                    : `${selectedGenres.length} Genre${selectedGenres.length > 1 ? 's' : ''}`}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl py-2 max-h-72 overflow-y-auto animate-in fade-in zoom-in duration-200">
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className="w-full px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 transition-colors text-left"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedGenres.includes(genre) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                      {selectedGenres.includes(genre) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${selectedGenres.includes(genre) ? 'text-blue-700 font-semibold' : 'text-slate-600'}`}>
                      {genre}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid Rendering */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Curating your library...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-400 text-lg">No books match your search.</p>
          <button 
            onClick={() => {setActiveQuery(""); setSelectedGenres([]); setSearchInput("")}}
            className="mt-4 text-blue-600 font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
