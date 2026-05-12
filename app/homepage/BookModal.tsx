"use client"

import { useState } from "react"
import { Books } from "@/types/Books"
import { BookCopy } from "@/types/BookCopy"
import Image from "next/image"
import { CheckCircle2, AlertCircle, X } from "lucide-react"

import { BookDetails } from "./BookDetails" 
import { BookPurchaseView } from "./BookPurchaseView"
import { BookBorrowView } from "./BookBorrowView"

type Props = {
  book: Books
  onClose: () => void
  memberId: string
}

export default function BookModal({ book, onClose, memberId }: Props) {
  const [step, setStep] = useState<"details" | "purchase" | "success" | "borrow" | "borrow_success">("details")
  
  const [selectedCopy, setSelectedCopy] = useState<BookCopy | null>(
    book.copies && book.copies.length > 0 ? book.copies[0] : null
  )
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'e-wallet'>('cash')
  
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCopyChange = (copy: BookCopy) => {
    setSelectedCopy(copy)
    setQuantity(1)
    setError(null)
  }

  const handleQuantityChange = (qty: number) => {
    setQuantity(qty)
    setError(null)
  }

  const handlePaymentMethodChange = (method: 'cash' | 'card' | 'e-wallet') => {
    setPaymentMethod(method)
    setError(null)
  }

  const hasCopies = book.copies && book.copies.length > 0
  const isOutOfStock = selectedCopy?.stock === 0
  
  const maxStock = selectedCopy?.stock ?? Infinity 
  
  const totalPrice = selectedCopy 
    ? (quantity * Number(selectedCopy.price)).toFixed(2) 
    : "0.00"

  const handlePurchaseSubmit = async () => {
    if (!selectedCopy) return;

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
          payment_amount: parseFloat(totalPrice),
          payment_method: paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to complete purchase."); 
        setIsSubmitting(false);
        return;
      }

      setStep("success"); 

    } catch {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBorrowSubmit = async () => {
    if (!selectedCopy) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/transactions/borrow', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: Number(memberId),
          book_copy_id: selectedCopy.id, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to complete borrow request."); 
        setIsSubmitting(false);
        return;
      }

      setStep("borrow_success"); 

    } catch {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuccessStep = step === "success" || step === "borrow_success";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-none relative flex max-w-6xl w-full overflow-hidden min-h-[600px] border border-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-none bg-white/80 backdrop-blur text-slate-400 hover:text-slate-900 hover:bg-white border border-slate-100 transition-all z-30 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT: GALLERY VIEW */}
        {!isSuccessStep && (
          <div className="relative w-[380px] lg:w-[480px] flex-shrink-0 hidden md:flex items-center justify-center bg-slate-50 border-r border-slate-100 group">
            {/* Soft backdrop blur for the image area */}
            <div className="absolute inset-0 opacity-10 grayscale">
              <Image
                src={`/booksdb/${book.id}/cover.jpg`}
                alt=""
                fill
                className="object-cover blur-2xl scale-150"
              />
            </div>
            
            <div className="relative w-[85%] aspect-[2/3] z-10">
              <Image
                src={`/booksdb/${book.id}/cover.jpg`}
                alt={book.title}
                fill
                priority
                sizes="(max-width: 768px) 0vw, 480px"
                className="object-contain"
              />
            </div>
            
            {/* Subtle paper texture overlay */}
            <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]" />
          </div>
        )}

        {/* RIGHT: DYNAMIC CONTENT */}
        <div className={`px-10 pb-10 pt-20 sm:px-16 sm:pb-16 sm:pt-24 flex flex-col w-full ${isSuccessStep ? "md:w-full items-center justify-center text-center max-w-3xl mx-auto" : "md:flex-grow justify-center"}`}>
          
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
              setSelectedCopy={handleCopyChange}
              quantity={quantity}
              setQuantity={handleQuantityChange}
              paymentMethod={paymentMethod}
              setPaymentMethod={handlePaymentMethodChange}
              maxStock={maxStock}
              isOutOfStock={isOutOfStock}
              totalPrice={totalPrice}
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
              setSelectedCopy={handleCopyChange}
              isOutOfStock={isOutOfStock}
              error={error}
              isSubmitting={isSubmitting}
              onBack={() => setStep("details")}
              onSubmit={handleBorrowSubmit}
            />
          )}


          {/* --- STEP 3.A: PURCHASE SUCCESS UI --- */}
          {step === "success" && (
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center max-w-md w-full">
              <div className="w-24 h-24 bg-green-50 text-green-600 rounded-none flex items-center justify-center mb-8">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {paymentMethod === 'cash' ? "Order Confirmed" : "Payment Successful"}
              </h2>
              <p className="text-slate-500 mb-8 font-medium text-center">
                You&apos;ve successfully purchased {quantity} {selectedCopy?.format}(s) of <span className="text-slate-900">{book.title}</span>.
              </p>

              <div className="w-full space-y-4 mb-8">
                {selectedCopy?.format === 'hardcopy' ? (
                  <div className="bg-blue-50 border border-blue-200 p-5 rounded-none">
                    <p className="text-blue-800 text-sm font-bold flex items-center gap-3 justify-center text-center uppercase tracking-wide">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      Please claim your book at the library counter
                    </p>
                  </div>
                ) : (
                  paymentMethod !== 'cash' && (
                    <div className="bg-green-50 border border-green-200 p-5 rounded-none">
                      <p className="text-green-800 text-sm font-bold flex items-center gap-3 justify-center text-center uppercase tracking-wide">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        Digital copy is now available in your profile
                      </p>
                    </div>
                  )
                )}

                {paymentMethod === 'cash' && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-none">
                    <p className="text-amber-800 text-xs font-bold flex items-center gap-3 justify-center text-center">
                      Our records show you chose Cash. Please settle your payment with the librarian to {selectedCopy?.format === 'hardcopy' ? 'receive your copy' : 'activate your digital access'}.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-green-50 border border-green-100 p-8 rounded-none w-full mb-10 space-y-4">
                <div className="flex justify-between items-center text-green-700 font-medium">
                  <span className="text-lg">Total Cost</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">${totalPrice}</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-none hover:bg-blue-700 transition cursor-pointer"
              >
                Return to Library
              </button>
            </div>
          )}

          {/* --- STEP 3.B: BORROW SUCCESS UI --- */}
          {step === "borrow_success" && (
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center max-w-md w-full">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-none flex items-center justify-center mb-8">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Borrowing Complete</h2>
              <p className="text-slate-500 mb-8 font-medium">
                You now have access to <span className="text-slate-900">{book.title}</span> ({selectedCopy?.format}).
              </p>

              {selectedCopy?.format === 'hardcopy' && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-none w-full mb-6">
                  <p className="text-blue-700 text-sm font-bold flex items-center gap-3 justify-center text-center">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    Please go to the librarian so that they can give you your book.
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-100 p-6 rounded-none w-full mb-10">
                  <p className="text-blue-700 text-sm font-semibold flex items-center gap-2 justify-center">
                    <AlertCircle className="w-4 h-4" />
                    Please return it within 14 days.
                  </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-none hover:bg-black transition cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
