import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: params.callbackUrl || "/" })
            }}
          >
            <Button variant="outline" className="w-full" type="submit">
              Sign in with Google
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {params.error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {params.error === "CredentialsSignin" || params.error === "MissingCSRF"
                ? "Invalid email or password"
                : "An error occurred. Please try again."}
            </div>
          )}

          <form
            action={async (formData: FormData) => {
              "use server"
              const email = formData.get("email") as string
              const password = formData.get("password") as string

              await signIn("credentials", {
                email,
                password,
                redirectTo: params.callbackUrl || "/",
              })
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="m@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
