"use client"

import { useState, useEffect } from "react"
import { Books } from "@/types/Books"
import { BookCopy } from "@/types/BookCopy"
import Image from "next/image"
import { CheckCircle2, AlertCircle } from "lucide-react"

import { BookDetails } from "./BookDetails" 
import { BookPurchaseView } from "./BookPurchaseView"
import { BookBorrowView } from "./BookBorrowView"

type Props = {
  book: Books
  onClose: () => void
  memberId: string
}

export default function BookModal({ book, onClose, memberId }: Props) {
 
  // Added "borrow" and "borrow_success" states
  const [step, setStep] = useState<"details" | "purchase" | "success" | "borrow" | "borrow_success">("details")
  
  const [selectedCopy, setSelectedCopy] = useState<BookCopy | null>(
    book.copies && book.copies.length > 0 ? book.copies[0] : null
  )
  const [quantity, setQuantity] = useState(1)
  const [paymentAmount, setPaymentAmount] = useState<string>("")
  
  // UI Feedback states
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [changeAmount, setChangeAmount] = useState<string | null>(null)

  // Clear errors when the user changes inputs
  useEffect(() => {
    setError(null)
  }, [paymentAmount, quantity, selectedCopy])

  useEffect(() => {
    setQuantity(1)
    setPaymentAmount("")
  }, [selectedCopy])

  const hasCopies = book.copies && book.copies.length > 0
  const isOutOfStock = selectedCopy?.stock === 0
  
  const maxStock = selectedCopy?.stock ?? Infinity 
  
  const totalPrice = selectedCopy 
    ? (quantity * Number(selectedCopy.price)).toFixed(2) 
    : "0.00"

  const parsedPayment = parseFloat(paymentAmount) || 0
  const isPaymentSufficient = parsedPayment >= parseFloat(totalPrice)

  // --- PURCHASE LOGIC ---
  const handlePurchaseSubmit = async () => {
    if (!selectedCopy || !isPaymentSufficient) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/transactions/purchase', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: Number(memberId),
          book_copy_id: selectedCopy.id, 
          quantity: quantity,
          payment_amount: parsedPayment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to complete purchase."); 
        setIsSubmitting(false);
        return;
      }

      setChangeAmount(data.change_amount);
      setStep("success"); 

    } catch (err) {
      console.error("Network or unexpected error during purchase:", err);
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- BORROW LOGIC ---
  const handleBorrowSubmit = async () => {
    if (!selectedCopy) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Assuming your provided API route is saved at /api/transactions/borrow
      const response = await fetch('/api/transactions/borrow', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: Number(memberId),
          book_copy_id: selectedCopy.id, 
          // Defaulting to API's 14-day calculation by not passing due_date
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to complete borrow request."); 
        setIsSubmitting(false);
        return;
      }

      setStep("borrow_success"); 

    } catch (err) {
      console.error("Network or unexpected error during borrow:", err);
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuccessStep = step === "success" || step === "borrow_success";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-xl relative flex max-w-6xl w-full overflow-hidden min-h-[500px]">
        
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl z-10"
        >
          ✕
        </button>

        {/* LEFT: IMAGE */}
        {!isSuccessStep && (
          <div className="relative w-[340px] sm:w-[420px] aspect-[2/3] flex-shrink-0 hidden md:block">
            <Image
              src={`/booksdb/${book.id}/cover.jpg`}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 0vw, 420px"
              className="object-cover"
            />
          </div>
        )}

        {/* RIGHT: DYNAMIC CONTENT */}
        <div className={`p-10 flex flex-col justify-center w-full ${isSuccessStep ? "md:w-full items-center" : "md:w-[520px]"}`}>
          
         {/* --- STEP 1: DETAILS --- */}
         {step === "details" && (
            <BookDetails 
              book={book}
              hasCopies={hasCopies}
              onBorrow={() => setStep("borrow")}
              onPurchase={() => setStep("purchase")}
            />
          )}


          {/* --- STEP 2.A: PURCHASE --- */}
          {step === "purchase" && (
            <BookPurchaseView
              book={book}
              selectedCopy={selectedCopy}
              setSelectedCopy={setSelectedCopy}
              quantity={quantity}
              setQuantity={setQuantity}
              paymentAmount={paymentAmount}
              setPaymentAmount={setPaymentAmount}
              maxStock={maxStock}
              isOutOfStock={isOutOfStock}
              totalPrice={totalPrice}
              isPaymentSufficient={isPaymentSufficient}
              error={error}
              isSubmitting={isSubmitting}
              onBack={() => setStep("details")}
              onSubmit={handlePurchaseSubmit}
            />
          )}

          {/* --- STEP 2.B: BORROW --- */}
          {step === "borrow" && (
            <BookBorrowView
              book={book}
              selectedCopy={selectedCopy}
              setSelectedCopy={setSelectedCopy}
              isOutOfStock={isOutOfStock}
              error={error}
              isSubmitting={isSubmitting}
              onBack={() => setStep("details")}
              onSubmit={handleBorrowSubmit}
            />
          )}


          {/* --- STEP 3.A: PURCHASE SUCCESS UI --- */}
          {step === "success" && (
             /* Your existing purchase success UI here */
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center max-w-md w-full py-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
              <p className="text-gray-500 mb-8">
                You bought {quantity} {selectedCopy?.format}(s) of <span className="font-semibold text-gray-700">{book.title}</span>.
              </p>

              <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl w-full mb-8 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Total Cost</span>
                  <span className="font-medium text-gray-900">${totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Amount Paid</span>
                  <span className="font-medium text-gray-900">${parsedPayment.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200 w-full my-2"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-900">Your Change</span>
                  <span className="font-bold text-green-600">${changeAmount}</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-lg"
              >
                Done
              </button>
            </div>
          )}

          {/* --- STEP 3.B: BORROW SUCCESS UI --- */}
          {step === "borrow_success" && (
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center max-w-md w-full py-8">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Borrow Successful!</h2>
              <p className="text-gray-500 mb-8">
                You have successfully borrowed a <span className="font-semibold">{selectedCopy?.format}</span> copy of <span className="font-semibold text-gray-700">{book.title}</span>.
              </p>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl w-full mb-8">
                  <p className="text-blue-800 text-sm font-medium">Please return or renew it within 14 days.</p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-lg"
              >
                Done
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}