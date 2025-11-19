"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserLinkProps {
  href: string
  image?: string | null
  name?: string | null
  username?: string | null
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export function UserLink({ href, image, name, username, onClick }: UserLinkProps) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      onClick={onClick}
    >
      <Avatar className="h-4 w-4">
        <AvatarImage src={image || ""} alt={name || ""} />
        <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
          {(name || username || "U")[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[100px]">
        {name || username || "Anonymous"}
      </span>
    </Link>
  )
}

