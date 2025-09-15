import NextForm from "next/form"
import { Section } from "../../../common/section-wrapper"
import { Input } from "../../../common/input"
import { fragmentOn } from "basehub"
import { submitNewsletter } from "./actions"

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

  const overrideTitle = "AI Is Coming for Every Business Model Except Communities"
  const overrideDescription =
    "Communities are humanity's economic moat — build yours right. Build your community with attribution intelligence on your own domain. Save $600/year vs Skool. See exactly where every member comes from."

  return (
    <Section className="bg-[--surface-secondary] !py-10 dark:bg-[--dark-surface-secondary]" container="full">
      <div className="container mx-auto flex flex-col gap-4 px-6 lg:flex-row lg:justify-between">
        <div className="flex flex-1 flex-col items-start gap-1">
          <h5 className="text-xl font-medium lg:text-2xl">{overrideTitle}</h5>
          <p className="text text-[--text-tertiary] dark:text-[--dark-text-tertiary] lg:text-lg">
            {overrideDescription}
          </p>
        </div>

        <NextForm
          action={submitNewsletter.bind(null, newsletter.submissions.ingestKey, newsletter.submissions.schema)}
        >
          <Input {...emailInput} />
        </NextForm>
      </div>
    </Section>
  )
}
