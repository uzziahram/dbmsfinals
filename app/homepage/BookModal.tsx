"use client"

import { useState, useEffect } from "react"
import { Books } from "@/types/Books"
import { BookCopy } from "@/types/BookCopy"
import Image from "next/image"

type Props = {
  book: Books
  onClose: () => void
}

export default function BookModal({ book, onClose }: Props) {
  // State to manage which screen the user is seeing
  const [step, setStep] = useState<"details" | "purchase">("details")
  
  // Dynamically initialize to the first available copy
  const [selectedCopy, setSelectedCopy] = useState<BookCopy | null>(
    book.copies && book.copies.length > 0 ? book.copies[0] : null
  )
  const [quantity, setQuantity] = useState(1)
  
  // State for the user's payment input
  const [paymentAmount, setPaymentAmount] = useState<string>("")

  // Reset quantity and payment back to defaults if the user switches formats
  useEffect(() => {
    setQuantity(1)
    setPaymentAmount("")
  }, [selectedCopy])

  const hasCopies = book.copies && book.copies.length > 0
  const isOutOfStock = selectedCopy?.stock === 0
  
  // If stock is null (like for digital softcopies), default to Infinity
  const maxStock = selectedCopy?.stock ?? Infinity 
  
  // Safely calculate total price based on the selected copy's price
  const totalPrice = selectedCopy 
    ? (quantity * Number(selectedCopy.price)).toFixed(2) 
    : "0.00"

  // Check if the entered payment is sufficient
  const parsedPayment = parseFloat(paymentAmount) || 0
  const isPaymentSufficient = parsedPayment >= parseFloat(totalPrice)

  const handlePurchaseSubmit = () => {
    if (!selectedCopy || !isPaymentSufficient) return
    
    const change = (parsedPayment - parseFloat(totalPrice)).toFixed(2)
    console.log(`Purchasing ${quantity} ${selectedCopy.format}(s) of ${book.title} for $${totalPrice}.`)
    console.log(`Amount Paid: $${parsedPayment.toFixed(2)} | Change: $${change}`)
    
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-xl relative flex max-w-6xl w-full overflow-hidden min-h-[500px]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl z-10"
        >
          ✕
        </button>

        {/* LEFT: IMAGE */}
        <div className="relative w-[340px] sm:w-[420px] aspect-[2/3] flex-shrink-0 hidden md:block">
          <Image
            src={`/booksdb/${book.id}/cover.jpg`}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>

        {/* RIGHT: DYNAMIC CONTENT */}
        <div className="p-10 flex flex-col justify-center w-full md:w-[520px]">
          
          {step === "details" ? (
            /* --- STEP 1: BOOK DETAILS --- */
            <div className="animate-in fade-in duration-300">
              <h2 className="text-3xl font-bold text-gray-900">{book.title}</h2>
              <p className="text-sm text-gray-600 mt-2">by {book.author}</p>
              <p className="mt-5 text-sm text-gray-700 leading-relaxed">{book.description}</p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  Borrow
                </button>
                <button 
                  onClick={() => hasCopies && setStep("purchase")}
                  disabled={!hasCopies}
                  className={`flex-1 px-5 py-3 text-white rounded-lg transition ${
                    hasCopies 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-gray-400 cursor-not-allowed opacity-70"
                  }`}
                >
                  {hasCopies ? "Buy Now" : "Unavailable"}
                </button>
              </div>
            </div>
          ) : (
            /* --- STEP 2: PURCHASE OPTIONS --- */
            <div className="animate-in slide-in-from-right-4 duration-300 flex flex-col h-full">
              <div>
                <button 
                  onClick={() => setStep("details")}
                  className="text-blue-500 text-sm font-medium mb-4 hover:underline"
                >
                  ← Back to details
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Options</h2>

                {/* Dynamic Format Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Select Format</label>
                  <div className="flex gap-4 flex-wrap">
                    {book.copies?.map((copy) => (
                      <button
                        key={copy.id}
                        onClick={() => setSelectedCopy(copy)}
                        className={`flex-1 min-w-[120px] py-3 border-2 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
                          selectedCopy?.id === copy.id 
                          ? "border-green-500 bg-green-50 text-green-700" 
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <span className="capitalize font-semibold">{copy.format}</span>
                        <span className="text-sm">${Number(copy.price).toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="mt-8">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Quantity</label>
                    {selectedCopy?.stock !== null && (
                      <span className="text-xs text-gray-500">
                        {isOutOfStock ? "Out of stock" : `${selectedCopy?.stock} available`}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock || quantity <= 1}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold w-8 text-center">
                      {isOutOfStock ? 0 : quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                      disabled={isOutOfStock || quantity >= maxStock}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Payment Input Section */}
                {!isOutOfStock && (
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Amount ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={`Enter amount (Min: $${totalPrice})`}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    />
                    
                    {/* Fixed height container prevents the UI from jumping */}
                    <div className="h-5 mt-1">
                      {paymentAmount && !isPaymentSufficient && (
                        <p className="text-red-500 text-xs font-medium animate-in fade-in">
                          Insufficient funds. Minimum required is ${totalPrice}.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Total & Submit */}
              <div className="mt-auto pt-6">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                  <span className="text-gray-700 font-medium">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">${totalPrice}</span>
                </div>

                <button 
                  onClick={handlePurchaseSubmit}
                  disabled={isOutOfStock || !selectedCopy || !isPaymentSufficient}
                  className="w-full py-4 bg-green-600 text-white font-bold rounded-lg transition shadow-lg shadow-green-200 hover:bg-green-700 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {isOutOfStock 
                    ? "Out of Stock" 
                    : !isPaymentSufficient && paymentAmount 
                      ? "Insufficient Funds" 
                      : "Confirm Purchase"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}