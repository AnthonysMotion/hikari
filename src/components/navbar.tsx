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
import { Home, Tv, BookOpen, LogIn, LogOut, User, Sparkles, ListChecks, BookMarked, Flame, Star, UserCircle, Settings, Trophy } from "lucide-react"
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
      <div className="flex-1 py-6 flex flex-col gap-6 px-2 justify-start overflow-y-auto">
        {/* Main Navigation */}
        <div className="flex flex-col gap-1">
          <Link 
            href="/" 
            className="flex items-center h-10 px-2 rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200 relative group/nav"
          >
            <Home className="w-5 h-5 flex-shrink-0 transition-transform group-hover/nav:scale-110" />
            <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Home
            </span>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* User Navigation Section */}
        {session?.user && (
          <>
            <div className="relative">
              <div className="absolute inset-x-0 top-0 flex items-center px-2">
                <div className="flex-1 border-t border-sidebar-border/30 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="px-2 text-[10px] font-medium text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  My Lists
                </span>
                <div className="flex-1 border-t border-sidebar-border/30 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col gap-1 pt-5 mt-2">
                <Link 
                  href="/anime-list" 
                  className="flex items-center h-10 px-2 rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200 relative group/nav"
                >
                  <ListChecks className="w-5 h-5 flex-shrink-0 transition-transform group-hover/nav:scale-110" />
                  <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    My Anime List
                  </span>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
                </Link>
                <Link 
                  href="/manga-list" 
                  className="flex items-center h-10 px-2 rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200 relative group/nav"
                >
                  <BookMarked className="w-5 h-5 flex-shrink-0 transition-transform group-hover/nav:scale-110" />
                  <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    My Manga List
                  </span>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Public Navigation Section */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 flex items-center px-2">
            <div className="flex-1 border-t border-sidebar-border/30 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="px-2 text-[10px] font-medium text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Discover
            </span>
            <div className="flex-1 border-t border-sidebar-border/30 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col gap-1 pt-5 mt-2">
            <Link 
              href="/anime" 
              className="flex items-center h-10 px-2 rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200 relative group/nav"
            >
              <Flame className="w-5 h-5 flex-shrink-0 transition-transform group-hover/nav:scale-110" />
              <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Top Anime
              </span>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
            </Link>
            <Link 
              href="/manga" 
              className="flex items-center h-10 px-2 rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200 relative group/nav"
            >
              <Star className="w-5 h-5 flex-shrink-0 transition-transform group-hover/nav:scale-110" />
              <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Top Manga
              </span>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* Account Section */}
        {session?.user && (
          <div className="relative">
            <div className="absolute inset-x-0 top-0 flex items-center px-2">
              <div className="flex-1 border-t border-sidebar-border/30 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="px-2 text-[10px] font-medium text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Account
              </span>
              <div className="flex-1 border-t border-sidebar-border/30 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col gap-1 pt-5 mt-2">
              <Link 
                href={`/user/${(session.user as any)?.id || session.user?.id}`}
                className="flex items-center h-10 px-2 rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200 relative group/nav"
              >
                <UserCircle className="w-5 h-5 flex-shrink-0 transition-transform group-hover/nav:scale-110" />
                <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Profile
                </span>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
              </Link>
              <Link 
                href="/settings" 
                className="flex items-center h-10 px-2 rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200 relative group/nav"
              >
                <Settings className="w-5 h-5 flex-shrink-0 transition-transform group-hover/nav:scale-110" />
                <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Settings
                </span>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
              </Link>
              <Link 
                href="/gamification" 
                className="flex items-center h-10 px-2 rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200 relative group/nav"
              >
                <Trophy className="w-5 h-5 flex-shrink-0 transition-transform group-hover/nav:scale-110" />
                <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Challenges
                </span>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section Divider */}
      <div className="px-2">
        <div className="border-t border-sidebar-border/50 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Theme Toggle */}
      <div className="px-2 pb-3">
        <div className="rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 transition-colors">
          <ThemeToggle />
        </div>
      </div>

      {/* User Section */}
      <div className="px-2 pb-4 border-t border-sidebar-border/50 dark:border-white/5 pt-3">
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center w-full h-12 px-2 rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 transition-all duration-200 outline-none group/button">
                <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-sidebar-border/50 dark:ring-white/10 group-hover/button:ring-primary/30 transition-all duration-200">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {session.user.name?.[0] || session.user.email?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex flex-col items-start overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-1 min-w-0">
                  <span className="text-sm font-semibold truncate w-full text-left">
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
            className="flex items-center h-12 px-2 rounded-lg hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200 relative group/nav border border-sidebar-border/30 dark:border-white/5 hover:border-primary/30"
          >
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary/10 group-hover/nav:bg-primary/20 transition-colors">
              <LogIn className="w-5 h-5 flex-shrink-0 transition-transform group-hover/nav:scale-110 text-primary" />
            </div>
            <span className="ml-3 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Sign In
            </span>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
          </Link>
        )}
      </div>
    </nav>
  )
}
