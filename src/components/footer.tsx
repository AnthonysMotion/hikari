import Link from "next/link"
import { Sparkles, Github, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-20">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-gradient">Hikari</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your personal anime and manga sanctuary. Track, discover, and immerse yourself in the world of Japanese animation.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#anime" className="text-muted-foreground hover:text-primary transition-colors">
                  Top Anime
                </Link>
              </li>
              <li>
                <Link href="/#manga" className="text-muted-foreground hover:text-primary transition-colors">
                  Top Manga
                </Link>
              </li>
              <li>
                <Link href="/anime-list" className="text-muted-foreground hover:text-primary transition-colors">
                  My Anime List
                </Link>
              </li>
              <li>
                <Link href="/manga-list" className="text-muted-foreground hover:text-primary transition-colors">
                  My Manga List
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/profile/edit" className="text-muted-foreground hover:text-primary transition-colors">
                  Edit Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Hikari. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              About
            </Link>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-muted-foreground">
            Developed by{" "}
            <Link
              href="https://anthonythach.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Anthony Thach
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

