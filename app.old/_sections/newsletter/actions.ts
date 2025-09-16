'use server';

import { parseFormData, sendEvent } from "basehub/events";

const MAILERLITE_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiOTNhNWQ5NGM3ZjA0NTJlMjA4N2UyOWNlMmFjN2U4YmE4N2I2N2JiZGFiZjRiMTBkMWVhYTVhZDI3ZWUzMTYwYjE4NzNmZGFiNzJmZTJmY2YiLCJpYXQiOjE3NTc5MzA2ODguNTkzNjQ4LCJuYmYiOjE3NTc5MzA2ODguNTkzNjUxLCJleHAiOjQ5MTM2MDQyODguNTg4NTI2LCJzdWIiOiIxNzUxMDI4Iiwic2NvcGVzIjpbXX0.lGPZO5r5uMyMDxUg1JucVBaBlKISwmgnCmDywhMnN4PyOtfBir4Wmoli9SuLPeLED4K_FUAgIIWs8MwR3QrPWVp5sw69qQeJLaC_L4tzUY6XuUv1qWQ5wzbzrysIhnjfPzNv2jAEJ2libLBZ58IoJsrgGb-ddTiHUB9weZE4gMqyD1muede2H8XNnMYZnRPbRMEISFN_nGjS7P4EVdgxcMChJSW18qMixaCGadJOIkabJ08IXr6TtN9FaQPF8PGh2_b26A9uVzDmNriFMilj-XAJXdrB-F61YlRbPjNN2YzCdeOY8DkApsz6LTWPPRCTnefG731em36UNp2hPGo7PtI8k4tchMnytZ5KqDahBrWaIeje05jel0NVViaf1BTDArhpjwNpO8fTOpn5Vh-4yAENBWNZNE7Sv1t-8Ij8BQOG07Ttvr8omrWzfFWi-V8HRIdUiju1T5poBUjuk2ujlkC0qSvUN9R8EeDBqGkA6GvARd5kWjAcZ2qq92OM2-Ilo1JlPxjnPFQiJ7wilW9KiYB9iKuADLHGTN1iQzozUhYPZgjLtApvBHr4A86HRzJU_a7c_m_Hct3YQ1kG7Hy8926WlHbNI-V4zt8ozgqD3nWFu1DzhGMqRwCYzy5y9WWazHG5p0f-S7geD7KRUPXNiRz19oFLlOXwMaw-tPWTV20"
const MAILERLITE_GROUP_ID = "165602281678440191"

export async function submitNewsletter(ingestKey: string, schema: any[], data: FormData) {
  const parsedData = parseFormData(ingestKey, schema, data);
  if (!parsedData.success) {
    throw new Error(JSON.stringify(parsedData.errors));
  }
  
  // Send to basehub
  await sendEvent(ingestKey, parsedData.data);
  
  // Also send to MailerLite
  const email = data.get('email') as string;
  if (email) {
    try {
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
            groups: [MAILERLITE_GROUP_ID],
            status: "active",
          }),
        }
      );

      if (!response.ok && response.status !== 409) {
        console.error("MailerLite API error:", await response.text());
      }
    } catch (error) {
      console.error("Failed to add to MailerLite:", error);
      // Don't throw - we don't want to break the form if MailerLite fails
    }
  }
}