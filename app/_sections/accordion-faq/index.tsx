import type { Faq } from "../../_sections/faq"

import { Heading } from "../../../common/heading"
import { Section } from "../../../common/section-wrapper"

import { Accordion } from "./accordion"
import type { GeneralEvents } from "../../../lib/basehub/fragments"

export function AccordionFaq(faq: Faq & { eventsKey: GeneralEvents["ingestKey"] }) {
  const midpoint = Math.ceil(faq.questions.items.length / 2)
  const leftColumnItems = faq.questions.items.slice(0, midpoint)
  const rightColumnItems = faq.questions.items.slice(midpoint)

  return (
    <Section>
      <Heading {...faq.heading}>
        <h4>{faq.heading.title}</h4>
      </Heading>
      <div className="mx-auto w-full max-w-5xl pl-[4.5rem] pr-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="flex flex-col w-full">
            <Accordion items={leftColumnItems} eventsKey={faq.eventsKey} />
          </div>
          <div className="flex flex-col w-full">
            <Accordion items={rightColumnItems} eventsKey={faq.eventsKey} />
          </div>
        </div>
      </div>
    </Section>
  )
}
