import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to Hikari ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our anime and manga tracking service.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
              <p>
                When you create an account, we may collect information such as:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Name and username</li>
                <li>Email address</li>
                <li>Profile picture and banner image</li>
                <li>Authentication credentials (handled securely through third-party providers)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
              <p>
                We automatically collect information about how you interact with our service, including:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Anime and manga lists (completed, watching, planning, etc.)</li>
                <li>Episode and chapter progress</li>
                <li>Reviews and ratings</li>
                <li>Activity feed posts</li>
                <li>Preferences and settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your experience</li>
              <li>Track your anime and manga progress</li>
              <li>Enable social features (following, activity feeds)</li>
              <li>Generate gamification elements (levels, achievements, badges)</li>
              <li>Communicate with you about your account or our services</li>
              <li>Monitor and analyze usage patterns and trends</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Public Profile:</strong> Your username, profile picture, and anime/manga lists are visible to other users</li>
              <li><strong>Service Providers:</strong> We may share data with third-party service providers who assist in operating our platform</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access and update your personal information through your account settings</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of certain data collection practices</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We use cookies and similar tracking technologies to enhance your experience, analyze usage, and assist in marketing efforts. You can control cookie preferences through your browser settings.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Our service is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="font-mono text-primary">
              <Link href="https://anthonythach.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                anthonythach.com
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

