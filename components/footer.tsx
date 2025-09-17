"use client"

import { isExternalLink } from "@/app/_utils/links"
import { ButtonLink } from "@/common/button"
import { DarkLightImageAutoscale } from "@/common/dark-light-image"
import type { DarkLightImageFragment, FooterFragment } from "@/lib/basehub/fragments"
import Link from "next/link"
import Image from "next/image"
import { ThemeSwitcher } from "./theme-switcher"

declare global {
  interface Window {
    Featurebase: any
  }
}

export const Footer = ({
  footer,
  logo,
}: {
  footer: FooterFragment
  logo: DarkLightImageFragment
}) => {
  return (
    <footer className="border-t border-[--border] py-8 dark:border-[--dark-border]">
      <div className="container mx-auto grid grid-cols-2 grid-rows-[auto_auto] place-items-start items-center gap-y-7 px-6 sm:grid-cols-[1fr_auto_1fr] sm:grid-rows-1 sm:gap-x-3">
        <Link aria-label="Homepage" href="/">
          <Image 
            src="/allumiblack.png" 
            alt="Allumi" 
            width={120} 
            height={40} 
            priority 
            className="h-8 w-auto dark:hidden" 
          />
          <Image 
            src="/allumi.png" 
            alt="Allumi" 
            width={120} 
            height={40} 
            priority 
            className="hidden h-8 w-auto dark:block" 
          />
        </Link>
        <nav className="col-start-1 row-start-2 flex flex-row flex-wrap gap-x-2 gap-y-3 self-center sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:items-center sm:place-self-center md:gap-x-4 lg:gap-x-8">
          <Link
            href="/about"
            className="px-2 font-light tracking-tight text-[--text-tertiary] hover:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:text-[--dark-text-primary]"
          >
            About
          </Link>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.Featurebase) {
                window.Featurebase('showNewMessage', 'Hi! I need help with Allumi.');
              }
            }}
            className="px-2 font-light tracking-tight text-[--text-tertiary] hover:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:text-[--dark-text-primary]"
          >
            Help
          </button>
          <button
            data-featurebase-feedback
            className="px-2 font-light tracking-tight text-[--text-tertiary] hover:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:text-[--dark-text-primary]"
          >
            Feedback
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.Featurebase) {
                window.Featurebase('showNewMessage', 'I found a bug in Allumi');
              }
            }}
            className="px-2 font-light tracking-tight text-[--text-tertiary] hover:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:text-[--dark-text-primary]"
          >
            Bug Report
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.Featurebase) {
                window.Featurebase('showNewMessage', 'I have a feature request for Allumi');
              }
            }}
            className="px-2 font-light tracking-tight text-[--text-tertiary] hover:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:text-[--dark-text-primary]"
          >
            Feature Request
          </button>
          <Link
            href="/affiliate"
            className="px-2 font-light tracking-tight text-[--text-tertiary] hover:text-[--text-primary] dark:text-[--dark-text-secondary] dark:hover:text-[--dark-text-primary]"
          >
            Affiliate Program
          </Link>
        </nav>
        <div className="col-start-2 row-start-1 flex items-center gap-3 self-center justify-self-end sm:col-span-1 sm:col-start-3 sm:row-start-1">
          <p className="hidden text-[--text-tertiary] dark:text-[--dark-text-tertiary] sm:block">Appearance</p>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  )
}
