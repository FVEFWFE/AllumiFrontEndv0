"use server"

import { parseFormData, sendEvent } from "basehub/events"

export async function subscribeToNewsletter(
  ingestKey: string,
  schema: any,
  data: FormData
) {
  const parsedData = parseFormData(ingestKey, schema, data)
  if (!parsedData.success) {
    throw new Error(JSON.stringify(parsedData.errors))
  }
  await sendEvent(ingestKey, parsedData.data)
}