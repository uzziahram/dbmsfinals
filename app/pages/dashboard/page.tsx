import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/app/lib/auth/auth"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/pages/login")
  }

  return (
    <div>
      hi
    </div>
  )
}