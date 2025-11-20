import { auth } from "@/auth"
import { TopNavbar } from "@/components/top-navbar"
import { UserNavbar } from "@/components/user-navbar"

export async function Navbar() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  if (!isLoggedIn) {
    return <TopNavbar />
  }

  return <UserNavbar user={session?.user as any} />
}
