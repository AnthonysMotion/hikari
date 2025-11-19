# Hikari

A local anime/manga platform built with Next.js, Prisma, and SQLite.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd hikari
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory:
    ```env
    # Database
    DATABASE_URL="file:<absolute-path-to-your-project>/prisma/dev.db"

    # NextAuth.js Configuration
    AUTH_SECRET="your-secret-key-here-at-least-32-chars"
    # Generate with: openssl rand -base64 32

    # Google OAuth (Optional - only if using Google Sign-In)
    AUTH_GOOGLE_ID="your-google-client-id"
    AUTH_GOOGLE_SECRET="your-google-client-secret"
    ```

4.  **Initialize the database:**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Seed the database:**
    ```bash
    npx prisma db seed
    ```

6.  **Run the development server:**
    ```bash
    npm run dev
    ```

## Adding Data

To add new anime or manga:

1.  Open `prisma/data.json`.
2.  Add a new entry to the `anime` or `manga` array.
3.  Run the seed command again:
    ```bash
    npx prisma db seed
    ```

The seed script will update existing entries (based on title) or create new ones.

## Authentication

### Setting up Google OAuth (Optional)

1.  Go to [Google Cloud Console](https://console.cloud.google.com/)
2.  Create a new project
3.  Go to **APIs & Services > Credentials**
4.  Create **OAuth Client ID**
5.  Set **Authorized redirect URIs** to: `http://localhost:3000/api/auth/callback/google`
6.  Copy the **Client ID** and **Client Secret** to your `.env` file

### Credentials Sign-In

Users can sign up directly using email/password. The password is hashed using bcrypt before storage.

## Tech Stack

-   **Frontend:** Next.js 14+, Tailwind CSS, shadcn/ui
-   **Backend:** Next.js API Routes (Server Actions/Server Components)
-   **Database:** SQLite
-   **ORM:** Prisma
-   **Authentication:** NextAuth.js (Auth.js)

## Important Notes

-   Never commit `.env` files - they contain sensitive information
-   The `.gitignore` file is configured to exclude:
    -   Environment variables (`.env*`)
    -   Database files (`prisma/dev.db`)
    -   Generated Prisma client (`/src/generated`)
    -   `node_modules`
    -   `.next/` build files
