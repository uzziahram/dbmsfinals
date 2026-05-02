import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth/auth"
import Payload from "@/types/Payload"
import { LogOut } from "lucide-react"
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

  // 1. Define the Server Action
  async function logout() {
    "use server" // This directive makes it a Server Action
    const cookieStore = await cookies()
    cookieStore.delete("token") // Delete the auth cookie
    redirect("/login") // Redirect to the login page
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <ClientProfile memberId={memberIdFromToken} />

          <div className="mt-8 flex justify-between items-center">
            <Link href="/homepage" className="text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>

            {/* 2. Wrap the button in a form that calls the Server Action */}
            <form action={logout}>
              <button 
                type="submit" 
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}