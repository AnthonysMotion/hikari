import Link from "next/link"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Tv, BookOpen, LogIn, LogOut, User, Sparkles, ListChecks, BookMarked, Flame, Star, UserCircle, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="fixed left-0 top-0 h-screen w-16 hover:w-64 bg-sidebar/80 dark:bg-black/40 backdrop-blur-xl border-r border-sidebar-border dark:border-white/10 transition-all duration-300 ease-in-out z-50 flex flex-col group overflow-hidden">
      {/* Logo Area */}
        <div className="h-16 flex items-center flex-shrink-0 px-4 border-b border-sidebar-border/50 dark:border-white/5">
        <div className="w-8 h-8 flex items-center justify-center text-primary">
          <Sparkles className="w-6 h-6" />
        </div>
        <span className="ml-4 font-bold text-xl tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-gradient">
          Hikari
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 flex flex-col gap-2 px-2 justify-center">
        <Link 
          href="/" 
          className="flex items-center h-10 px-2 rounded-md hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="w-6 h-6 flex-shrink-0" />
          <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Home
          </span>
        </Link>
        {session?.user && (
          <>
            <Link 
              href="/anime-list" 
              className="flex items-center h-10 px-2 rounded-md hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ListChecks className="w-6 h-6 flex-shrink-0" />
              <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                My Anime List
              </span>
            </Link>
            <Link 
              href="/manga-list" 
              className="flex items-center h-10 px-2 rounded-md hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookMarked className="w-6 h-6 flex-shrink-0" />
              <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                My Manga List
              </span>
            </Link>
            <Link 
              href={`/user/${(session.user as any)?.id || session.user?.id}`}
              className="flex items-center h-10 px-2 rounded-md hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <UserCircle className="w-6 h-6 flex-shrink-0" />
              <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Profile
              </span>
            </Link>
          </>
        )}
        <Link 
          href="/#anime" 
          className="flex items-center h-10 px-2 rounded-md hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Flame className="w-6 h-6 flex-shrink-0" />
          <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Top Anime
          </span>
        </Link>
        <Link 
          href="/#manga" 
          className="flex items-center h-10 px-2 rounded-md hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Star className="w-6 h-6 flex-shrink-0" />
          <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Top Manga
          </span>
        </Link>
      </div>

      {/* Theme Toggle */}
      <div className="p-2 border-t border-sidebar-border/50 dark:border-white/5">
        <ThemeToggle />
      </div>

      {/* User Section */}
      <div className="p-2 border-t border-sidebar-border/50 dark:border-white/5">
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center w-full h-12 px-1 rounded-md hover:bg-sidebar-accent dark:hover:bg-white/10 transition-colors outline-none">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                  <AvatarFallback>{session.user.name?.[0] || session.user.email?.[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex flex-col items-start overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium truncate w-full text-left">
                    {session.user.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate w-full text-left">
                    {session.user.email}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 ml-2" side="right" align="end" forceMount>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/user/${(session.user as any)?.id || session.user?.id}`} className="w-full flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/edit" className="w-full flex items-center">
                  <span>Edit Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="w-full flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form
                  action={async () => {
                    "use server"
                    await signOut({ redirectTo: "/" })
                  }}
                  className="w-full"
                >
                  <button className="w-full flex items-center text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link 
            href="/login" 
            className="flex items-center h-10 px-2 rounded-md hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogIn className="w-6 h-6 flex-shrink-0" />
            <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Sign In
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
