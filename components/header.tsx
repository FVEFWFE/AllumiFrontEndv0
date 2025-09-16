import { ButtonLink } from "@/common/button"
import { DarkLightImageAutoscale } from "@/common/dark-light-image"
import { DesktopMenu, MobileMenu } from "./navigation-menu"
import type { DarkLightImageFragment, HeaderFragment } from "@/lib/basehub/fragments"
import Link from "next/link"
import Image from "next/image"

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
          <Link className="flex items-center ring-offset-2" href="/">
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
          <div className="flex items-center gap-4">
            <DesktopMenu {...header} />
          </div>
          <MobileMenu {...header} />
        </div>
      </div>
    </header>
  )
}
