import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) {
    redirect("/pages/login")
  }

  return (
    <div>
      hi
    </div>
  )
}