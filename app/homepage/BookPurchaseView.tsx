import { Books } from "@/types/Books"
import { BookCopy } from "@/types/BookCopy"
import { AlertCircle, Banknote, CreditCard, Wallet } from "lucide-react"

type BookPurchaseViewProps = {
  book: Books
  selectedCopy: BookCopy | null
  setSelectedCopy: (copy: BookCopy) => void
  quantity: number
  setQuantity: (qty: number) => void
  paymentMethod: 'cash' | 'card' | 'e-wallet'
  setPaymentMethod: (method: 'cash' | 'card' | 'e-wallet') => void
  maxStock: number
  isOutOfStock: boolean
  totalPrice: string
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
  paymentMethod,
  setPaymentMethod,
  maxStock,
  isOutOfStock,
  totalPrice,
  error,
  isSubmitting,
  onBack,
  onSubmit
}: BookPurchaseViewProps) {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300 flex flex-col h-full w-full">
      <div className="overflow-y-auto pr-2 max-h-[60vh]">
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
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock || quantity <= 1 || isSubmitting}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xl"
            >
              -
            </button>
            <span className="text-lg font-bold w-8 text-center">
              {isOutOfStock ? 0 : quantity}
            </span>
            <button 
              type="button"
              onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
              disabled={isOutOfStock || quantity >= maxStock || isSubmitting}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`py-3 border-2 rounded-lg transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'cash'
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <Banknote className="w-5 h-5" />
              <span className="text-xs font-bold">Cash</span>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`py-3 border-2 rounded-lg transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'card'
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-bold">Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('e-wallet')}
              className={`py-3 border-2 rounded-lg transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'e-wallet'
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-xs font-bold">E-Wallet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Total & Submit */}
      <div className="mt-auto pt-6 bg-white">
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
          disabled={
            isOutOfStock || 
            !selectedCopy || 
            isSubmitting
          }
          className="w-full py-4 bg-green-600 text-white font-bold rounded-lg transition flex items-center justify-center shadow-lg shadow-green-200 hover:bg-green-700 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : isOutOfStock ? (
            "Out of Stock" 
          ) : (
            "Confirm Purchase"
          )}
        </button>
      </div>
    </div>
  )
}
