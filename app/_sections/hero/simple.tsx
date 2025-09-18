"use client"

import clsx from "clsx"
import { TrackedButtonLink } from "../../../components/tracked-button"

type Hero = {
  _analyticsKey?: string
  tagline?: React.ReactNode
  customerSatisfactionBanner?: {
    text: string
    avatars?: {
      items: Array<{
        _id: string
        avatar?: any
      }>
    }
  }
  title?: string | { line1: React.ReactNode; line2: React.ReactNode }
  subtitle?: string
  actions?: Array<{
    _id: string
    href: string
    label: string
    sublabel?: string
    type: string
    onClick?: string
  }>
  eventsKey?: string
  onActionClick?: (action: any) => void
}

export function Hero(hero: Hero) {
  if (!hero.title || !hero.subtitle) {
    return null
  }

  return (
    <section className="hero-section relative min-h-[calc(630px-var(--header-height))] overflow-hidden pb-10">
      <div className="absolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] border-b border-[--border] dark:border-[--dark-border]">
        {/* Decorations */}
        <div className="col-span-1 flex h-full items-center justify-center" />
        <div className="col-span-1 flex h-full items-center justify-center border-x border-[--border] dark:border-[--dark-border]" />
        <div className="col-span-1 flex h-full items-center justify-center" />
      </div>
      {/* --- */}
      <figure className="pointer-events-none absolute -bottom-[70%] left-1/2 z-0 block aspect-square w-[520px] -translate-x-1/2 rounded-full bg-[--accent-500-40] blur-[200px]" />
      <figure className="pointer-events-none absolute left-[4vw] top-[64px] z-20 hidden aspect-square w-[32vw] rounded-full bg-[--surface-primary] opacity-50 blur-[100px] dark:bg-[--dark-surface-primary] md:block" />
      <figure className="pointer-events-none absolute bottom-[-50px] right-[7vw] z-20 hidden aspect-square w-[30vw] rounded-full bg-[--surface-primary] opacity-50 blur-[100px] dark:bg-[--dark-surface-primary] md:block" />
      {/* --- */}
      <div className="relative z-10 flex flex-col divide-y divide-[--border] pt-[35px] dark:divide-[--dark-border]">
        {hero.customerSatisfactionBanner && (
          <div className="flex flex-col items-center justify-end">
            <div className="flex items-center gap-2 !border !border-b-0 border-[--border] px-4 py-2 dark:border-[--dark-border]">
              <p className="text-sm tracking-tight text-[--text-tertiary] dark:text-[--dark-text-tertiary]">
                {hero.customerSatisfactionBanner.text}
              </p>
            </div>
          </div>
        )}
        <div>
          <div className="mx-auto flex min-h-[288px] max-w-[80vw] shrink-0 flex-col items-center justify-center gap-2 px-2 py-4 sm:px-16 lg:px-24">
            {hero.tagline && (
              <div className="mb-2 text-center">
                <span className="inline-block rounded-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 px-4 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-300 border border-purple-200/20 dark:border-purple-700/20">
                  {hero.tagline}
                </span>
              </div>
            )}
            <h1 className="pointer-events-none relative text-balance text-center text-3xl font-medium leading-tight tracking-tight text-[--text-primary] dark:text-[--dark-text-primary] sm:text-4xl md:text-5xl lg:text-6xl">
              {typeof hero.title === "object" && "line1" in hero.title ? (
                <div className="flex flex-col">
                  <span className="inline-block">{hero.title.line1}</span>
                  <span className="inline-block">{hero.title.line2}</span>
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: hero.title.replace(
                      /([\w\s,.\'\"\(\)\/\-\!]+)/gi,
                      (match) => {
                        const trimmed = match.replace(/,$/, "");
                        const shouldntDecorate = ["a", "to", "the", "and", "or", "but", "in", "with", "at", "from"];
                        if (shouldntDecorate.includes(trimmed.toLocaleLowerCase())) return match;
                        return `<span className="hero-title-word">${match}</span>`;
                      }
                    ),
                  }}
                />
              )}
            </h1>
            <p className="cursor-target max-w-[480px] text-balance text-center text-base text-[--text-secondary] dark:text-[--dark-text-secondary] sm:text-lg">
              {hero.subtitle}
            </p>
          </div>
        </div>
        <div className="container relative mx-auto flex max-w-full flex-row flex-wrap items-center justify-center gap-4 px-4 pb-2 pt-8">
          {hero.actions?.map((action, index) => (
            <TrackedButtonLink
              key={action._id || index}
              href={action.href}
              variant={action.type as "primary" | "secondary"}
              onClick={(e) => {
                e.preventDefault()
                hero.onActionClick?.(action)
              }}
              eventsKey={hero.eventsKey || ""}
              eventName="hero_cta_clicked"
              eventProperties={{
                cta_type: action.label,
                cta_variant: action.type,
              }}
            >
              <span className="flex flex-col">
                <span>{action.label}</span>
                {action.sublabel && (
                  <span className="text-xs font-normal opacity-70">{action.sublabel}</span>
                )}
              </span>
            </TrackedButtonLink>
          ))}
        </div>
      </div>
    </section>
  )
}