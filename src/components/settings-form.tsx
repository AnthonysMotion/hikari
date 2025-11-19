"use client"

import { useState, useTransition, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateSettings } from "@/actions/settings"
import { useRouter } from "next/navigation"
import { Loader2, Moon, Sun, Palette } from "lucide-react"

interface SettingsFormProps {
  user: {
    accentColor: string | null
  }
}

const PRESET_COLORS = [
  { name: "Purple", value: "#a855f7" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Indigo", value: "#6366f1" },
]

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [accentColor, setAccentColor] = useState(user.accentColor || PRESET_COLORS[0].value)

  useEffect(() => {
    setMounted(true)
    if (user.accentColor) {
      setAccentColor(user.accentColor)
    }
  }, [user.accentColor])

  useEffect(() => {
    if (mounted && accentColor) {
      // Apply accent color to CSS variables
      document.documentElement.style.setProperty("--accent-color", accentColor)
      
      // Update primary color based on accent
      const rgb = hexToRgb(accentColor)
      if (rgb) {
        // Convert to oklch format (simplified conversion)
        const lightness = (Math.max(rgb.r, rgb.g, rgb.b) / 255) * 0.9 + 0.1
        const chroma = Math.min(0.2, (Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b)) / 255 * 0.3)
        const hue = rgbToHue(rgb.r, rgb.g, rgb.b)
        
        // Update CSS variables for accent color
        document.documentElement.style.setProperty(
          "--accent-custom",
          `oklch(${lightness} ${chroma} ${hue})`
        )
      }
    }
  }, [accentColor, mounted])

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  const rgbToHue = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0

    if (max === min) {
      h = 0
    } else if (max === r) {
      h = ((g - b) / (max - min)) % 6
    } else if (max === g) {
      h = (b - r) / (max - min) + 2
    } else {
      h = (r - g) / (max - min) + 4
    }

    h = Math.round(h * 60)
    if (h < 0) h += 360
    return h
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      try {
        await updateSettings({
          accentColor: accentColor || null,
        })
        router.refresh()
      } catch (error) {
        console.error("Failed to update settings:", error)
        setError("Failed to update settings. Please try again.")
      }
    })
  }

  const handleColorChange = (color: string) => {
    setAccentColor(color)
  }

  if (!mounted) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </CardTitle>
          <CardDescription>Choose your preferred theme and appearance settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
                className="flex-1"
              >
                <Sun className="w-4 h-4 mr-2" />
                Light
              </Button>
              <Button
                type="button"
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
                className="flex-1"
              >
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </Button>
              <Button
                type="button"
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => setTheme("system")}
                className="flex-1"
              >
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accent Color Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Accent Color
          </CardTitle>
          <CardDescription>Choose a custom accent color for your website experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accent-color">Custom Accent Color</Label>
            <div className="flex items-center gap-4">
              <Input
                id="accent-color"
                type="color"
                value={accentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-24 h-12 cursor-pointer"
                disabled={isPending}
              />
              <Input
                type="text"
                value={accentColor}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^#[0-9A-F]{6}$/i.test(value)) {
                    handleColorChange(value)
                  } else if (value.length <= 7) {
                    setAccentColor(value)
                  }
                }}
                placeholder="#a855f7"
                className="flex-1 font-mono"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preset Colors</Label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorChange(color.value)}
                  className={`w-full aspect-square rounded-lg border-2 transition-all ${
                    accentColor === color.value
                      ? "border-foreground scale-110 ring-2 ring-offset-2 ring-offset-background"
                      : "border-border hover:border-foreground/50 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  disabled={isPending}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <div className="flex gap-2 flex-wrap">
              <div
                className="px-4 py-2 rounded-md text-white font-medium"
                style={{ backgroundColor: accentColor }}
              >
                Accent Button
              </div>
              <div
                className="px-4 py-2 rounded-md border-2 font-medium"
                style={{
                  borderColor: accentColor,
                  color: accentColor,
                }}
              >
                Accent Border
              </div>
              <div
                className="px-4 py-2 rounded-md font-medium"
                style={{
                  color: accentColor,
                  backgroundColor: `${accentColor}20`,
                }}
              >
                Accent Text
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setAccentColor(PRESET_COLORS[0].value)
            document.documentElement.style.removeProperty("--accent-color")
            document.documentElement.style.removeProperty("--accent-custom")
          }}
          disabled={isPending}
        >
          Reset to Default
        </Button>
      </div>
    </form>
  )
}

