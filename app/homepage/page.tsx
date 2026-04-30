import { verifyToken } from "@/lib/auth/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Payload from "@/types/Payload"
import BookShelves from "@/app/homepage/BookShelves"
import Link from "next/link"
import { User } from "lucide-react"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value


  if (!token) {
    redirect("/login")
  }

  const memberVerification = verifyToken(token)
  const member: Payload = memberVerification


  // ================> DEV PURPOSES
  // console.log(member)
  

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <header className="mb-8 flex items-center justify-between bg-blue-600 text-white p-6 rounded-xl shadow-md">
  
        {/* Left side */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, <span className="text-blue-100">{member.memberUserName}</span>
          </h1>
          <p className="text-blue-100 mt-1">
            Discover and manage your books 📚
          </p>
        </div>

        {/* Profile Button */}
        <Link
          href={`/profile/${member.memberId}`}
          className="p-2 rounded-full hover:bg-blue-500 transition"
          title="Go to Profile"
        >
          <User className="w-6 h-6 text-white" />
        </Link>

      </header>

        {/* Main Content */}
        <main>
          <BookShelves />
        </main>

      </div>
    </div>
  )
}