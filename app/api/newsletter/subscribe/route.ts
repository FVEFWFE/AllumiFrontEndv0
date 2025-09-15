import { NextResponse } from "next/server"

const MAILERLITE_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiOTNhNWQ5NGM3ZjA0NTJlMjA4N2UyOWNlMmFjN2U4YmE4N2I2N2JiZGFiZjRiMTBkMWVhYTVhZDI3ZWUzMTYwYjE4NzNmZGFiNzJmZTJmY2YiLCJpYXQiOjE3NTc5MzA2ODguNTkzNjQ4LCJuYmYiOjE3NTc5MzA2ODguNTkzNjUxLCJleHAiOjQ5MTM2MDQyODguNTg4NTI2LCJzdWIiOiIxNzUxMDI4Iiwic2NvcGVzIjpbXX0.lGPZO5r5uMyMDxUg1JucVBaBlKISwmgnCmDywhMnN4PyOtfBir4Wmoli9SuLPeLED4K_FUAgIIWs8MwR3QrPWVp5sw69qQeJLaC_L4tzUY6XuUv1qWQ5wzbzrysIhnjfPzNv2jAEJ2libLBZ58IoJsrgGb-ddTiHUB9weZE4gMqyD1muede2H8XNnMYZnRPbRMEISFN_nGjS7P4EVdgxcMChJSW18qMixaCGadJOIkabJ08IXr6TtN9FaQPF8PGh2_b26A9uVzDmNriFMilj-XAJXdrB-F61YlRbPjNN2YzCdeOY8DkApsz6LTWPPRCTnefG731em36UNp2hPGo7PtI8k4tchMnytZ5KqDahBrWaIeje05jel0NVViaf1BTDArhpjwNpO8fTOpn5Vh-4yAENBWNZNE7Sv1t-8Ij8BQOG07Ttvr8omrWzfFWi-V8HRIdUiju1T5poBUjuk2ujlkC0qSvUN9R8EeDBqGkA6GvARd5kWjAcZ2qq92OM2-Ilo1JlPxjnPFQiJ7wilW9KiYB9iKuADLHGTN1iQzozUhYPZgjLtApvBHr4A86HRzJU_a7c_m_Hct3YQ1kG7Hy8926WlHbNI-V4zt8ozgqD3nWFu1DzhGMqRwCYzy5y9WWazHG5p0f-S7geD7KRUPXNiRz19oFLlOXwMaw-tPWTV20"
const MAILERLITE_GROUP_ID = "165602281678440191"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Add subscriber to MailerLite
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          fields: {
            name: name || "",
          },
          groups: [MAILERLITE_GROUP_ID],
          status: "active",
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("MailerLite API error:", errorData)
      
      // Check if it's a duplicate subscriber error
      if (response.status === 409) {
        return NextResponse.json(
          { message: "You're already subscribed!" },
          { status: 200 }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Successfully subscribed to newsletter!",
        data 
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