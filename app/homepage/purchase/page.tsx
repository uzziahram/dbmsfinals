"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function PurchasePage() {
  const searchParams = useSearchParams()
  const bookId = searchParams.get("bookId")

  // State for the purchase options you wanted
  const [type, setType] = useState<"Hardcopy" | "Softcopy">("Hardcopy")
  const [quantity, setQuantity] = useState(1)

  // You would typically fetch the book details here using the bookId
  // useEffect(() => { fetchBook(bookId) }, [bookId])

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <p>Buying Book ID: {bookId}</p>

      {/* FORMAT SELECTION */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Select Format:</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => setType("Hardcopy")}
            className={`px-4 py-2 border rounded ${type === "Hardcopy" ? "bg-green-100 border-green-500" : ""}`}
          >
            Hardcopy
          </button>
          <button 
            onClick={() => setType("Softcopy")}
             className={`px-4 py-2 border rounded ${type === "Softcopy" ? "bg-green-100 border-green-500" : ""}`}
          >
            Softcopy
          </button>
        </div>
      </div>

      {/* QUANTITY SELECTION */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Quantity:</h3>
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 bg-gray-200 rounded">-</button>
          <span className="text-xl font-bold">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
        </div>
      </div>

    </div>
  )
}