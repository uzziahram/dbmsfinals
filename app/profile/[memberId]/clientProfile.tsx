"use client"

import { useEffect, useState } from "react"
import { User, BookOpen, ShoppingBag, Clock, History, Mail, Calendar } from "lucide-react"
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-none animate-spin" />
      <p className="text-slate-500 font-medium">Loading your profile...</p>
    </div>
  )
  
  if (!memberInfo) return (
    <div className="py-20 text-center text-red-500 font-medium">Failed to load profile.</div>
  )

  const dateJoined = new Date(memberInfo.member.created_at).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const activeBorrowsCount = memberInfo.borrowed.filter(
    (book: any) => !book.returned_at
  ).length;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Compact Header & Stats */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-12 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <div className="bg-slate-900 w-16 h-16 rounded-none flex items-center justify-center text-white flex-shrink-0">
            <User className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              {memberInfo.member.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-slate-500 font-bold text-xs tracking-wide">
              <span className="text-blue-600">@{memberInfo.member.username}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>Joined {dateJoined}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:w-40 bg-slate-50 p-4 border border-slate-200 rounded-none flex flex-col justify-center">
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{activeBorrowsCount}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Borrows</p>
          </div>
          <div className="flex-1 lg:w-40 bg-slate-50 p-4 border border-slate-200 rounded-none flex flex-col justify-center">
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{memberInfo.purchased.length}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Purchased</p>
          </div>
        </div>
      </div>

      {/* Book Collections - Full Width Grid */}
      <div className="grid grid-cols-1 gap-16">
        <section>
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-900">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-slate-900" />
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                Active & Past Borrowings
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Collection I</span>
          </div>
          <BorrowedBooks books={memberInfo.borrowed} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-900">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-slate-900" />
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                Acquired Works
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Collection II</span>
          </div>
          <PurchasedBooks books={memberInfo.purchased} />
        </section>
      </div>
    </div>
  )
}
