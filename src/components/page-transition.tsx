"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [pathname, children])

  useEffect(() => {
    if (displayChildren) {
      setIsVisible(true)
    }
  }, [displayChildren])

  return (
    <div
      className={`transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ minHeight: "inherit" }}
    >
      {displayChildren}
    </div>
  )
}

