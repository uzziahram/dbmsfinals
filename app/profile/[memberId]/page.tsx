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

  const { memberId } = await  params

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

  //========> DEV PURPOSES
  // console.log("PROFILE ROUTE HIT")
  // console.log("params.memberId:", params.memberId)
  // console.log("type:", typeof params.memberId)
  // console.log("token memberId:", member.memberId)

  // console.log(memberId)
  //========>
  
  const memberIdFromToken = Number(member.memberId)
  const memberIdFromParams = Number(memberId)

  if (memberIdFromParams !== memberIdFromToken) {
    redirect("/login")
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