import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import LoginModal from "./loginModal"

export default async function LoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (token) {
    redirect("/pages/homepage")
  }

  return <LoginModal />
}