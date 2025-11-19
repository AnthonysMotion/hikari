"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

interface AccentColorLoaderProps {
  accentColor?: string | null
}

export function AccentColorLoader({ accentColor }: AccentColorLoaderProps) {
  const { theme } = useTheme()

  useEffect(() => {
    if (!accentColor) {
      document.documentElement.style.removeProperty("--accent-color")
      document.documentElement.style.removeProperty("--accent-custom-hsl")
      document.documentElement.style.removeProperty("--primary-custom")
      document.documentElement.style.removeProperty("--primary-custom-hsl")
      document.documentElement.style.removeProperty("--ring-custom")
      document.documentElement.style.removeProperty("--ring-custom-hsl")
      return
    }

    // Set the accent color hex as a CSS variable
    document.documentElement.style.setProperty("--accent-color", accentColor)

    // Convert hex to HSL for better color manipulation
    const hex = accentColor.replace("#", "")
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      if (max === r) {
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
      } else if (max === g) {
        h = ((b - r) / d + 2) / 6
      } else {
        h = ((r - g) / d + 4) / 6
      }
    }

    h = Math.round(h * 360)
    s = Math.round(s * 100)
    const lightness = Math.round(l * 100)

    // Adjust lightness based on theme for better visibility
    const isDark = theme === "dark"
    const adjustedLightness = isDark 
      ? Math.min(70, Math.max(lightness, 60))
      : Math.max(40, Math.min(lightness, 55))

    // Set HSL for use in CSS
    document.documentElement.style.setProperty(
      "--accent-custom-hsl",
      `${h} ${s}% ${adjustedLightness}%`
    )

    // Use HSL in oklch-like format for the accent variable
    const oklchLightness = adjustedLightness / 100
    const oklchChroma = Math.min(0.25, s / 100 * 0.4)
    
    document.documentElement.style.setProperty(
      "--accent-custom",
      `oklch(${oklchLightness.toFixed(3)} ${oklchChroma.toFixed(3)} ${h})`
    )

    // Also set primary color to use accent color (for buttons, badges, etc.)
    const primaryLightness = isDark ? Math.min(75, Math.max(lightness, 65)) : Math.max(45, Math.min(lightness, 55))
    const primaryChroma = Math.min(0.25, s / 100 * 0.4)
    
    document.documentElement.style.setProperty(
      "--primary-custom",
      `oklch(${(primaryLightness / 100).toFixed(3)} ${primaryChroma.toFixed(3)} ${h})`
    )
    document.documentElement.style.setProperty(
      "--primary-custom-hsl",
      `${h} ${s}% ${primaryLightness}%`
    )

    // Update ring color for focus states
    const ringLightness = isDark ? Math.min(65, Math.max(lightness, 55)) : Math.max(60, Math.min(lightness, 70))
    document.documentElement.style.setProperty(
      "--ring-custom",
      `oklch(${(ringLightness / 100).toFixed(3)} ${Math.min(0.2, primaryChroma).toFixed(3)} ${h})`
    )
    document.documentElement.style.setProperty(
      "--ring-custom-hsl",
      `${h} ${Math.max(40, s - 20)}% ${ringLightness}%`
    )
  }, [accentColor, theme])

  return null
}

// Keep the old export for backward compatibility
export const AccentColorProvider = AccentColorLoader

