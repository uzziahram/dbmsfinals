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
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/homepage" 
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors"
          >
            <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-blue-200 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </Link>

          <form action={logout}>
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-white border border-red-100 text-red-500 px-5 py-2.5 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all font-bold shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <ClientProfile memberId={memberIdFromToken} />
        </div>
      </div>
    </div>
  )
}
