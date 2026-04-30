"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { User, BookOpen, ShoppingBag, Clock, History } from "lucide-react"
import MemberProfile from "@/types/MemberProfiles"

export default function ClientProfile({ memberId }: { memberId: number }) {
  const [memberInfo, setMemberInfo] = useState<MemberProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/members/${memberId}`)
        const data = await res.json()
        setMemberInfo(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMember()
  }, [memberId])

  if (loading) return <p className="p-8 text-center text-gray-500">Loading profile...</p>
  if (!memberInfo) return <p className="p-8 text-center text-red-500">Failed to load profile.</p>

  const dateJoined = new Date(memberInfo.member.created_at).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-4 rounded-full text-white shadow-lg">
          <User className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {memberInfo.member.name}
          </h1>
          <p className="text-gray-500">@{memberInfo.member.username} • {memberInfo.member.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-blue-700">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Active Borrows</span>
          </div>
          <p className="text-3xl font-bold mt-2">{memberInfo.borrowed.length}</p>
        </div>

        <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-green-700">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Total Purchased</span>
          </div>
          <p className="text-3xl font-bold mt-2">{memberInfo.purchased.length}</p>
        </div>

        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
          <span className="font-medium text-gray-600 block">Member Since</span>
          <p className="text-xl font-bold mt-3 text-gray-800">{dateJoined}</p>
        </div>
      </div>

      {/* Borrowed Books Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" /> Borrowed History
        </h2>
        {memberInfo.borrowed.length > 0 ? (
          <div className="grid gap-3">
            {memberInfo.borrowed.map((book: any) => (
              <div key={book.id} className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm">
                
                {/* Left Side: Image + Details */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-16 sm:w-16 sm:h-24 flex-shrink-0">
                    <Image 
                      src={`/booksdb/${book.book_id}/cover.jpg`} 
                      alt={book.book_title}
                      fill
                      className="object-cover rounded shadow-sm border border-gray-200"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{book.book_title}</p>
                    <p className="text-sm text-gray-500">Format: {book.format}</p>
                  </div>
                </div>

                {/* Right Side: Status + Date */}
                <div className="text-right flex-shrink-0">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    book.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {book.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Due: {new Date(book.due_date).toLocaleDateString()}</p>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No books currently borrowed.</p>
        )}
      </section>

      {/* Purchased Books Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-500" /> Purchase History
        </h2>
        {memberInfo.purchased.length > 0 ? (
          <div className="grid gap-3">
            {memberInfo.purchased.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm">
                
                {/* Left Side: Image + Details */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-16 sm:w-16 sm:h-24 flex-shrink-0">
                    <Image 
                      src={`/booksdb/${item.book_id}/cover.jpg`} 
                      alt={item.book_title}
                      fill
                      className="object-cover rounded shadow-sm border border-gray-200"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.book_title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} • {item.format}</p>
                  </div>
                </div>

                {/* Right Side: Price + Date */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-green-600">₱{item.total_price.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{new Date(item.purchased_at).toLocaleDateString()}</p>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No purchase history available.</p>
        )}
      </section>
    </div>
  )
}