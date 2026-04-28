import { verifyToken } from "@/lib/auth/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Payload from "@/types/Payload"
import BookShelves from "@/app/pages/homepage/BookShelves"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/pages/login")
  }

  const memberVerification = verifyToken(token)
  const member: Payload = memberVerification

  return (
    <div style={{ padding: "40px 288px" }}>
      {/* Header */}
      <header style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
          Welcome {member.memberName}
        </h1>
        <p style={{ color: "#666" }}>Your personal dashboard</p>
      </header>

      {/* Main Content */}
      <main>
        <BookShelves />
      </main>
    </div>
  )
}