import { ButtonLink } from "@/common/button"
import { DarkLightImageAutoscale } from "@/common/dark-light-image"
import { DesktopMenu, MobileMenu } from "./navigation-menu"
import type { DarkLightImageFragment, HeaderFragment } from "@/lib/basehub/fragments"
import Link from "next/link"

export const Header = ({
  logo,
  header,
}: {
  logo: DarkLightImageFragment
  header: HeaderFragment
}) => {
  return (
    <header className="sticky left-0 top-0 z-[110] flex w-full flex-col border-b border-[--border] bg-[--surface-primary] dark:border-[--dark-border] dark:bg-[--dark-surface-primary]">
      <div className="flex h-[--header-height] bg-[--surface-primary] dark:bg-[--dark-surface-primary]">
        <div className="container mx-auto grid w-full grid-cols-[1fr_max-content_1fr] place-items-center content-center items-center px-6 *:first:justify-self-start">
          <ButtonLink unstyled className="flex items-center ring-offset-2" href="/">
            <DarkLightImageAutoscale priority {...logo} />
          </ButtonLink>
          <div className="flex items-center gap-4">
            <DesktopMenu {...header} />
            <Link
              href="/community"
              className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-[--text-primary] hover:text-[--accent-primary] dark:text-[--dark-text-primary] dark:hover:text-[--dark-accent-primary] transition-colors"
            >
              Community
            </Link>
          </div>
          <MobileMenu {...header} />
        </div>
      </div>
    </header>
  )
}
