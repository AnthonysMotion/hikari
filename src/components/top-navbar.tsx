"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Sparkles, Menu, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function TopNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20)
  })

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Anime", href: "#anime" },
    { name: "Manga", href: "#manga" },
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
            {navLinks.map((link) => (
                <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/5"
                >
                {link.name}
                </Link>
            ))}
            </nav>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <div className="scale-90 text-muted-foreground hover:text-foreground transition-colors">
            <ThemeToggle />
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/login">
            <Button className="rounded-full h-10 px-6 bg-white text-black hover:bg-white/90 font-semibold shadow-lg shadow-white/5 transition-all duration-300 hover:scale-105">
              Get Started
            </Button>
          </Link>
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
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 overflow-hidden absolute top-full left-0 right-0"
        >
          <div className="container px-4 py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-lg font-medium text-foreground/80 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-[1px] bg-white/10 my-2" />
            <Link 
              href="/login"
              className="px-4 py-3 text-lg font-medium text-foreground/80 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="mt-2">
              <Button className="w-full rounded-xl h-12 text-lg font-semibold bg-primary hover:bg-primary/90">
                Get Started <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
