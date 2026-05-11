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
      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
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
    <div className="p-8 sm:p-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="bg-blue-600 w-24 h-24 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-100 flex-shrink-0">
          <User className="w-10 h-10" />
        </div>

        <div className="flex-grow">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            {memberInfo.member.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-blue-600">@</span>
              {memberInfo.member.username}
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {memberInfo.member.email}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 hidden lg:block">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Calendar className="w-3.5 h-3.5" />
            Member Since
          </div>
          <p className="text-slate-700 font-bold">{dateJoined}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group bg-blue-50/50 border border-blue-100/50 p-8 rounded-[2rem] hover:bg-blue-50 hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Active</span>
          </div>
          <p className="text-slate-500 font-medium">Borrowed Books</p>
          <p className="text-5xl font-black text-slate-900 mt-1">{activeBorrowsCount}</p>
        </div>

        <div className="group bg-indigo-50/50 border border-indigo-100/50 p-8 rounded-[2rem] hover:bg-indigo-50 hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Total</span>
          </div>
          <p className="text-slate-500 font-medium">Purchased Items</p>
          <p className="text-5xl font-black text-slate-900 mt-1">{memberInfo.purchased.length}</p>
        </div>
      </div>

      {/* History Sections */}
      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-orange-400 rounded-full" />
            <h2 className="text-2xl font-bold text-slate-900">Borrowed History</h2>
          </div>
          <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
            <BorrowedBooks books={memberInfo.borrowed} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
            <h2 className="text-2xl font-bold text-slate-900">Purchase History</h2>
          </div>
          <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
            <PurchasedBooks books={memberInfo.purchased} />
          </div>
        </section>
      </div>
    </div>
  )
}
