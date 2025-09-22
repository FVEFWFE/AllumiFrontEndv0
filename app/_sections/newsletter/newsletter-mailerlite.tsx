"use client"

import { useState } from "react"
import { Section } from "../../../common/section-wrapper"
import TextType from "../../../components/TextType"

const MAILERLITE_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMzAyNzNhZTg1MzI2MGU3ZjM2YmE5MGIzZDcxZWEwOTVhODUxN2RjMmJkYmQ0ZDIxNzA2NWJjOGZjZDg5M2UxNDg3ZTUyZDg0M2NiNTZmZGIiLCJpYXQiOjE3NTgwNDYxMTUuMDE5MTU4LCJuYmYiOjE3NTgwNDYxMTUuMDE5MTYyLCJleHAiOjQ5MTM3MTk3MTUuMDExNTc4LCJzdWIiOiIxNzUxMDI4Iiwic2NvcGVzIjpbXX0.is0ny9DWls5mcOz2DCoS7r43R5HZcDQfqOwYLKiPgcqCK9zOmuKI0k8v8cMXmop3zRcOxYlFkRtPLLGk3V-lxUWKJlEUn54rjECBAZ5228DmK6MNnyI61izBbnMHrIFk08S1UHM1FQVHTu4Br3XdzUGVikvLeJMfl7YNgSluQQyfzQZB_ziljC6tMy2fT6GueRISFKr7vf0qMl3Ddy2dN5LgglfaqAV0NRbMV3djLncEZ6IOvS98DTLW8ZNfpp74PJw4nd2fNpnF1aQ2G6wMJ_xzh0bmVqi43QNovIVM1pdyJwohOLpObW2d7xiz7FveYLkF75oAWkmpjVdb3hjX4VMCNbhvlOmCzJQFU96ksaiYmvV3NDfqpEPBo354CgT1kwXVGcEqNktG1BmrjLxa790mS6Eg3P7oPbsDOdoZ8jr-oK2oahpc4AVvi9BRBgT0DoSOB3STPzc6egqIrCQpayB5WUPyqO8H3hxYWrLc-5SqrdrT22HVdFyMTru1UoMl4xz6G2ZPiyO771ZJqBc3sQWqjXw-WDNbF1ioMs6Uo7PfPY7vQ8S8jMy3zXdIcbSxgTeftoqUnV1sKt5X1MXFB_VXMplEqjpdF81tsTXWsgiXd3-WakIZuqwqyQapp3FMB4erpy3RjKRUcdiOgBbCn9KwEWedXXylFZpaxhmBbmg"
const FOOTER_GROUP_ID = "165602281678440191"

export function NewsletterMailerLite() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Track email capture with Universal Pixel
    if (typeof window !== 'undefined' && (window as any).Allumi) {
      (window as any).Allumi.identify({ email });
      (window as any).Allumi.track('email_captured', {
        source: 'newsletter_form',
        page: window.location.pathname
      });
    }

    try {
      const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          groups: [FOOTER_GROUP_ID]
        }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Success! Check your email for next steps." })
        setEmail("")
      } else {
        const errorData = await response.json()
        if (response.status === 409) {
          setMessage({ type: "error", text: "You're already subscribed!" })
        } else {
          setMessage({ type: "error", text: errorData.message || "Something went wrong." })
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "Connection error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Section className="bg-[--surface-secondary] !py-10 dark:bg-[--dark-surface-secondary]" container="full">
      <div className="container mx-auto flex flex-col gap-4 px-6 lg:flex-row lg:justify-between">
        <div className="flex flex-1 flex-col items-start gap-1">
          <h5 className="text-xl font-medium lg:text-2xl">
            You can't <TextType
              text={[
                "scale what you can't track.",
                "fix what you can't see.",
                "invest in what you don't measure.",
                "optimize what you can't measure."
              ]}
              typingSpeed={75}
              deletingSpeed={50}
              pauseDuration={1500}
              loop={true}
              showCursor={true}
              cursorCharacter="|"
              className="inline"
            />
          </h5>
          <p className="text text-[--text-tertiary] dark:text-[--dark-text-tertiary] lg:text-lg">
            Track what drives revenue in your Skool community. See which content brings members who pay and stay.
          </p>
        </div>

        {message && message.type === "success" ? (
          <div className="flex items-center justify-center sm:min-w-[320px] px-6 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-600 dark:text-green-400 font-medium">
              {message.text}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full sm:w-64 px-4 py-2 border border-[--border] dark:border-[--dark-border] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isLoading ? "Subscribing..." : "Get Started"}
            </button>
          </form>
        )}
      </div>
      
      {message && message.type === "error" && (
        <div className="container mx-auto px-6 mt-3">
          <p className="text-sm text-red-600 dark:text-red-400">
            {message.text}
          </p>
        </div>
      )}
    </Section>
  )
}