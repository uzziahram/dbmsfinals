import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth/auth"
import Payload from "@/types/Payload"
import { LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"

import ClientProfile from "@/app/profile/[memberId]/clientProfile"

type Props = {
  params: {
    memberId: string
  }
}

export default async function ProfilePage({ params }: Props) {
  const { memberId } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  const memberVerification = verifyToken(token)

  if (!memberVerification || typeof memberVerification === "string") {
    redirect("/login")
  }

  const member = memberVerification as Payload

  const memberIdFromToken = Number(member.memberId)
  const memberIdFromParams = Number(memberId)

  if (memberIdFromParams !== memberIdFromToken) {
    redirect("/login")
  }

  async function logout() {
    "use server"
    const cookieStore = await cookies()
    cookieStore.delete("token")
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link 
            href="/homepage" 
            className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 font-bold transition-colors"
          >
            <div className="p-2 rounded-none bg-slate-50 border border-slate-200 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Library</span>
          </Link>

          <form action={logout}>
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-6 py-2.5 rounded-none hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        <ClientProfile memberId={memberIdFromToken} />
      </main>
    </div>
  )
}
