import { Books } from "@/types/Books"
import { BookCopy } from "@/types/BookCopy"
import { AlertCircle, Banknote, CreditCard, Wallet, Plus, Minus } from "lucide-react"

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
    <div className="animate-in fade-in duration-500 flex flex-col h-full w-full">
      <div className="overflow-y-auto pr-2 max-h-[65vh] space-y-10">
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer relative z-10"
        >
          ← Back to Details
        </button>
        
        <div className="pt-2">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Purchase Options</h2>
        </div>

        {/* Format Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Format</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {book.copies?.map((copy) => (
              <button
                key={copy.id}
                onClick={() => setSelectedCopy(copy)}
                className={`py-4 border-2 rounded-none transition-all flex flex-col items-center justify-center gap-1 ${
                  selectedCopy?.id === copy.id 
                  ? "border-slate-900 bg-slate-900 text-white" 
                  : "border-slate-100 text-slate-500 hover:border-slate-200"
                }`}
              >
                <span className="capitalize font-bold text-sm">{copy.format}</span>
                <span className="text-sm opacity-80">${Number(copy.price).toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</label>
          <div className="flex items-center gap-6">
            <div className="flex items-center border border-slate-200 p-1">
              <button 
                type="button"
                onClick={() => {
                  console.log("Minus clicked, current qty:", quantity);
                  setQuantity(Math.max(1, quantity - 1));
                }}
                disabled={isOutOfStock || quantity <= 1 || isSubmitting}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer relative z-10"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <div className="w-12 flex items-center justify-center font-bold text-lg text-slate-900 select-none">
                {isOutOfStock ? 0 : quantity}
              </div>
              
              <button 
                type="button"
                onClick={() => {
                  console.log("Plus clicked, current qty:", quantity);
                  setQuantity(Math.min(maxStock, quantity + 1));
                }}
                disabled={isOutOfStock || quantity >= maxStock || isSubmitting}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer relative z-10"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {selectedCopy?.stock !== null && (
              <p className="text-sm text-slate-400 font-medium italic">
                {isOutOfStock ? "Out of stock" : `${selectedCopy?.stock} units available`}
              </p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            {['cash', 'card', 'e-wallet'].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method as any)}
                className={`py-4 border-2 rounded-none transition-all flex flex-col items-center justify-center gap-2 ${
                  paymentMethod === method
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-100 text-slate-500 hover:border-slate-200"
                }`}
              >
                {method === 'cash' && <Banknote className="w-5 h-5" />}
                {method === 'card' && <CreditCard className="w-5 h-5" />}
                {method === 'e-wallet' && <Wallet className="w-5 h-5" />}
                <span className="text-xs font-bold capitalize">{method.replace('-', ' ')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Total & Submit */}
      <div className="mt-auto pt-8 border-t border-slate-100 bg-white">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Amount</span>
            <span className="text-4xl font-bold text-slate-900 tracking-tight">${totalPrice}</span>
          </div>
          
          <button 
            onClick={onSubmit}
            disabled={isOutOfStock || !selectedCopy || isSubmitting}
            className="px-10 py-4 bg-blue-600 text-white font-bold rounded-none hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
          >
            {isSubmitting ? "Processing..." : "Confirm Purchase"}
          </button>
        </div>
      </div>
    </div>
  )
}
