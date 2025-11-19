"use server"

import { signIn } from "@/auth"
import { redirect } from "next/navigation"

export async function signInWithCredentials(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    redirect("/")
  } catch (error) {
    throw error
  }
}

