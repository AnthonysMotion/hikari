import { NextResponse } from "next/server"
import { updateNews } from "@/actions/news"

export async function GET() {
  try {
    const result = await updateNews()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating news:", error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const result = await updateNews()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating news:", error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

