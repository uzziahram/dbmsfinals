"use client"

import { useEffect, useState } from "react"
import { User, BookOpen } from "lucide-react"
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

  if (loading) return <p>Loading...</p>

  if (!memberInfo) return <p>Failed to load profile.</p>

  console.log(memberInfo)

  const dateOnly = new Date(String(memberInfo)).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-4 rounded-full text-white">
          <User className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {/* {memberInfo.} */}
          </h1>
          <p className="text-gray-500">Library Member</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Books Borrowed</span>
          </div>
          <p className="text-2xl font-bold mt-2">12</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl">
          <span className="font-medium text-gray-600">Member Since</span>
          <p className="text-2xl font-bold mt-2">
            {dateOnly}
          </p>
        </div>
      </div>
    </>
  )
}