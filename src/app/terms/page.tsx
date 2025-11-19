import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              By accessing or using Hikari ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Use License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Permission is granted to temporarily use Hikari for personal, non-commercial use only. Under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained in the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Maintaining the security of your account and password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring that you are at least 13 years old to use the Service</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>User Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You are responsible for all content that you post, upload, or otherwise make available on the Service, including:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Reviews and ratings</li>
              <li>Activity feed posts</li>
              <li>Profile information</li>
              <li>Comments and interactions</li>
            </ul>
            <p className="mt-4">
              You agree not to post content that:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Is illegal, harmful, threatening, abusive, or discriminatory</li>
              <li>Violates any intellectual property rights</li>
              <li>Contains spam, viruses, or malicious code</li>
              <li>Impersonates any person or entity</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The Service and its original content, features, and functionality are owned by Hikari and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              Anime and manga data, including titles, descriptions, and images, are provided for informational purposes and are the property of their respective rights holders.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Prohibited Uses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You agree not to use the Service:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate the company, an employee, another user, or any other person or entity</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Service Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We reserve the right to withdraw or amend the Service, and any service or material we provide via the Service, in our sole discretion without notice. We do not guarantee that the Service will be available at all times or that access will be uninterrupted.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, Hikari excludes all representations, warranties, conditions, and terms relating to our Service and the use of this Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              In no event shall Hikari, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which the Service is operated, without regard to its conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 border-white/10 dark:border-white/5 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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

