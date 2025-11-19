"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="flex items-center h-10 px-2 rounded-md text-muted-foreground w-full"
        disabled
      >
        <Sun className="w-6 h-6 flex-shrink-0" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center h-10 px-2 rounded-md hover:bg-sidebar-accent dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors w-full group-hover:w-full"
    >
      {theme === "dark" ? (
        <>
          <Moon className="w-6 h-6 flex-shrink-0" />
          <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Dark Mode
          </span>
        </>
      ) : (
        <>
          <Sun className="w-6 h-6 flex-shrink-0" />
          <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Light Mode
          </span>
        </>
      )}
    </button>
  )
}

