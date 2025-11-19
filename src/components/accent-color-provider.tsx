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
      document.documentElement.style.removeProperty("--accent-custom")
      return
    }

    // Set the accent color as a CSS variable
    document.documentElement.style.setProperty("--accent-color", accentColor)

    // Convert hex to RGB
    const hex = accentColor.replace("#", "")
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    // Convert RGB to HSL for better color manipulation
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255

    const max = Math.max(rNorm, gNorm, bNorm)
    const min = Math.min(rNorm, gNorm, bNorm)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      if (max === rNorm) {
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6
      } else if (max === gNorm) {
        h = ((bNorm - rNorm) / d + 2) / 6
      } else {
        h = ((rNorm - gNorm) / d + 4) / 6
      }
    }

    h = h * 360
    s = s * 100
    const lightness = l * 100

    // Create oklch color values based on theme
    const isDark = theme === "dark"
    const accentLightness = isDark ? Math.max(70, lightness) : Math.max(50, lightness - 10)
    const accentChroma = Math.min(0.2, s / 100 * 0.3)
    const accentHue = h

    // Set CSS variable for accent color in oklch format
    document.documentElement.style.setProperty(
      "--accent-custom",
      `oklch(${accentLightness / 100} ${accentChroma} ${accentHue})`
    )

    // Also set as HSL for compatibility
    document.documentElement.style.setProperty(
      "--accent-color-hsl",
      `${Math.round(h)} ${Math.round(s)}% ${Math.round(lightness)}%`
    )
  }, [accentColor, theme])

  return null
}

// Keep the old export for backward compatibility
export const AccentColorProvider = AccentColorLoader

