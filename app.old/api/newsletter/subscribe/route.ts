import { NextResponse } from "next/server"

// For now, just log emails and return success
// In production, you'll want to connect this to your email service
export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Log the signup (you can see these in Vercel logs)
    console.log("New waitlist signup:", { 
      email, 
      name: name || "Not provided",
      timestamp: new Date().toISOString() 
    })

    // For now, just return success
    // Later you can integrate with:
    // - Supabase (when configured)
    // - MailerLite, ConvertKit, or other email services
    // - Google Sheets API
    // - Airtable, etc.
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Successfully joined the waitlist! We'll be in touch soon.",
        data: { email, name }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}