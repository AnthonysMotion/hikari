import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { ThemeProvider } from "@/components/theme-provider";
import { AccentColorLoader } from "@/components/accent-color-loader";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Note: Fragment Mono is not available in Google Fonts, using JetBrains Mono as a similar alternative
// If you want to use Fragment Mono, you can use next/font/local and add the font files to public/fonts
const fragmentMono = JetBrains_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hikari",
  description: "Your personal anime and manga collection",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = (session?.user as any)?.id || session?.user?.id;
  const isLoggedIn = !!userId;

  let accentColor: string | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accentColor: true },
    });
    accentColor = user?.accentColor || null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${fragmentMono.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AccentColorLoader accentColor={accentColor} />
          <Navbar />
          <div className="flex-1 pt-24">
            <PageTransition>{children}</PageTransition>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
