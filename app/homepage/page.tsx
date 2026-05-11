import { verifyToken } from "@/lib/auth/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Payload from "@/types/Payload"
import BookShelves from "@/app/homepage/BookShelves"
import Link from "next/link"
import { User, LogOut } from "lucide-react"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  const memberVerification = verifyToken(token)
  const member: Payload = memberVerification

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Welcome back, <span className="text-blue-600 font-bold">{member.memberUserName}</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-light">
              Explore your library and discover your next great read.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/profile/${member.memberId}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all text-slate-600 font-medium"
              title="Go to Profile"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <BookShelves memberId={String(member.memberId)} /> 
        </main>

      </div>
    </div>
  )
}
