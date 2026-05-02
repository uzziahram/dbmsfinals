import { Books } from "@/types/Books"
import { BookCopy } from "@/types/BookCopy"
import { AlertCircle } from "lucide-react"

type BookPurchaseViewProps = {
  book: Books
  selectedCopy: BookCopy | null
  setSelectedCopy: (copy: BookCopy) => void
  quantity: number
  setQuantity: (qty: number) => void
  paymentAmount: string
  setPaymentAmount: (amount: string) => void
  maxStock: number
  isOutOfStock: boolean
  totalPrice: string
  isPaymentSufficient: boolean
  error: string | null
  isSubmitting: boolean
  onBack: () => void
  onSubmit: () => void
}

export function BookPurchaseView({
  book,
  selectedCopy,
  setSelectedCopy,
  quantity,
  setQuantity,
  paymentAmount,
  setPaymentAmount,
  maxStock,
  isOutOfStock,
  totalPrice,
  isPaymentSufficient,
  error,
  isSubmitting,
  onBack,
  onSubmit
}: BookPurchaseViewProps) {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300 flex flex-col h-full w-full">
      <div>
        <button 
          onClick={onBack}
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
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
          <span className="text-gray-700 font-medium">Total:</span>
          <span className="text-2xl font-bold text-gray-900">${totalPrice}</span>
        </div>

        <button 
          onClick={onSubmit}
          disabled={isOutOfStock || !selectedCopy || !isPaymentSufficient || isSubmitting}
          className="w-full py-4 bg-green-600 text-white font-bold rounded-lg transition flex items-center justify-center shadow-lg shadow-green-200 hover:bg-green-700 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : isOutOfStock ? (
            "Out of Stock" 
          ) : !isPaymentSufficient && paymentAmount ? (
            "Insufficient Funds" 
          ) : (
            "Confirm Purchase"
          )}
        </button>
      </div>
    </div>
  )
}