"use client"

import NextForm from "next/form"
import { Section } from "../../../common/section-wrapper"
import { Input } from "../../../common/input"
import { fragmentOn } from "basehub"
import { subscribeToNewsletter } from "./actions"
import TextType from "../../../components/TextType"

export const newsletterFragment = fragmentOn("Newsletter", {
  title: true,
  description: true,
  submissions: {
    ingestKey: true,
    schema: true,
  },
})

export type NewsletterFragment = fragmentOn.infer<typeof newsletterFragment>

export function Newsletter({ newsletter }: { newsletter: NewsletterFragment }) {
  const emailInput = newsletter.submissions.schema.find((field) => field.type === "email")

  const overrideDescription =
    "Track what drives revenue in your Skool community. See which content brings members who pay and stay."

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
            {overrideDescription}
          </p>
        </div>

        <NextForm
          action={subscribeToNewsletter.bind(
            null,
            newsletter.submissions.ingestKey,
            newsletter.submissions.schema
          )}
        >
          <Input {...emailInput} />
        </NextForm>
      </div>
    </Section>
  )
}
