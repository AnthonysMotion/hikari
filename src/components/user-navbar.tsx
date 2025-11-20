"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Sparkles, Menu, X, ChevronRight, User, Settings, LogOut, UserCircle, Trophy, ListChecks, BookMarked, Flame, Star, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
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
import { signOut } from "next-auth/react"

interface UserNavbarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    id?: string
  }
}

export function UserNavbar({ user }: UserNavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20)
  })

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "My Anime", href: "/anime-list", icon: ListChecks },
    { name: "My Manga", href: "/manga-list", icon: BookMarked },
    { name: "Browse", href: "/anime", icon: Flame },
    { name: "Challenges", href: "/gamification", icon: Trophy },
  ]

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/70 backdrop-blur-xl border-b border-white/10 py-3" 
          : "bg-transparent py-5"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-br from-primary to-violet-600 rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Hikari</span>
        </Link>

        {/* Desktop Nav - Centered */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <nav className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all rounded-full flex items-center gap-2",
                    isActive 
                      ? "bg-white/10 text-white shadow-sm" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
            </nav>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <div className="scale-90 text-muted-foreground hover:text-foreground transition-colors">
            <ThemeToggle />
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-all duration-200 outline-none group/button border border-transparent hover:border-white/5">
                <div className="text-right hidden lg:block">
                  <div className="text-sm font-medium text-white group-hover/button:text-primary transition-colors">{user.name || "User"}</div>
                </div>
                <Avatar className="h-8 w-8 ring-2 ring-white/10 group-hover/button:ring-primary/50 transition-all duration-200">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                    {user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 bg-background/80 backdrop-blur-xl border-white/10" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer">
                <Link href={`/user/${user.id}`} className="w-full flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer">
                <Link href="/profile/edit" className="w-full flex items-center">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer">
                <Link href="/settings" className="w-full flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="focus:bg-white/10 focus:text-red-400 text-red-400 cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-foreground hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 overflow-hidden absolute top-full left-0 right-0 shadow-2xl"
        >
          <div className="container px-4 py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-lg font-medium text-foreground/80 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
            <div className="h-[1px] bg-white/10 my-2" />
            <Link 
              href={`/user/${user.id}`}
              className="px-4 py-3 text-lg font-medium text-foreground/80 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
            <Link 
              href="/settings"
              className="px-4 py-3 text-lg font-medium text-foreground/80 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <button 
              className="w-full px-4 py-3 text-lg font-medium text-red-400 hover:bg-white/5 rounded-xl transition-all flex items-center gap-3 text-left"
              onClick={() => {
                setIsMobileMenuOpen(false)
                signOut({ callbackUrl: "/" })
              }}
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

