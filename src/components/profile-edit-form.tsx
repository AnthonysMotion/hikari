"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProfile } from "@/actions/profile"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProfileEditFormProps {
  user: {
    id: string
    name: string | null
    username: string | null
    bio: string | null
    image: string | null
    bannerImage: string | null
  }
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
    image: user.image || "",
    bannerImage: user.bannerImage || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    startTransition(async () => {
      try {
        await updateProfile({
          name: formData.name || undefined,
          username: formData.username || undefined,
          bio: formData.bio || undefined,
          image: formData.image || undefined,
          bannerImage: formData.bannerImage || undefined,
        })
        router.push(`/user/${formData.username || user.id}`)
        router.refresh()
      } catch (error) {
        console.error("Failed to update profile:", error)
        setError("Failed to update profile. Please try again.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="username"
            />
            <p className="text-sm text-muted-foreground">
              This will be used in your profile URL: /user/{formData.username || "username"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Images</CardTitle>
          <CardDescription>Add URLs for your profile and banner images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Profile Picture URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border"
                  onError={(e) => {
                    e.currentTarget.src = ""
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bannerImage">Banner Image URL</Label>
            <Input
              id="bannerImage"
              type="url"
              value={formData.bannerImage}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
              placeholder="https://example.com/banner.jpg"
            />
            {formData.bannerImage && (
              <div className="mt-2">
                <img
                  src={formData.bannerImage}
                  alt="Banner preview"
                  className="w-full h-32 rounded-lg object-cover border"
                  onError={(e) => {
                    e.currentTarget.src = ""
                  }}
                />
              </div>
            )}
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
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

