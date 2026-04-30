import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth/auth"
import Payload from "@/types/Payload"
import { User, BookOpen, LogOut } from "lucide-react"
import Link from "next/link"

type Props = {
  params: {
    usersName: string
  }
}

export default async function ProfilePage({ params }: Props) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/pages/login")
  }

  const memberVerification = verifyToken(token)
  const member: Payload = memberVerification

  // optional safety check (prevents URL spoofing)
  if (member.memberUserName !== params.usersName) {
    redirect(`/pages/profile/${member.memberUserName}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-4 rounded-full text-white">
              <User className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {member.memberUserName}
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
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-5 h-5" />
                <span className="font-medium">Member Since</span>
              </div>
              <p className="text-2xl font-bold mt-2">2026</p>
            </div>

          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-between items-center">

            <Link
              href="/pages/homepage"
              className="text-blue-600 hover:underline"
            >
              ← Back to Dashboard
            </Link>

            <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
              <LogOut className="w-4 h-4" />
              Logout
            </button>

          </div>

        </div>

      </div>
    </div>
  )
}