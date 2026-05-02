"use client"

import { useEffect, useState } from "react"
import { User, BookOpen, ShoppingBag, Clock, History } from "lucide-react"
import MemberProfile from "@/types/MemberProfiles"

import BorrowedBooks from "./borrowedBook" 
import PurchasedBooks from "./purchasedBooks" 

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
      
        <BorrowedBooks books={memberInfo.borrowed} />
        
      </section>

      {/* Purchased Books Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-500" /> Purchase History
        </h2>
       
        {/* Render the new component here */}
        <PurchasedBooks books={memberInfo.purchased} />
        
      </section>
    </div>
  )
}