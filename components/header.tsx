import { ButtonLink } from "@/common/button"
import { DarkLightImageAutoscale } from "@/common/dark-light-image"
import { DesktopNavigation, DesktopCTAs, MobileMenu } from "./navigation-menu"
import type { DarkLightImageFragment, HeaderFragment } from "@/lib/basehub/fragments"
import Link from "next/link"
import Image from "next/image"

export const Header = ({
  logo,
  header,
  onCtaClick,
}: {
  logo: DarkLightImageFragment
  header: HeaderFragment
  onCtaClick?: () => void
}) => {
  return (
    <header className="sticky left-0 top-0 z-[110] flex w-full flex-col border-b border-[--border] bg-background dark:border-[--dark-border]">
      <div className="flex h-[--header-height] bg-background">
        <div className="container mx-auto flex w-full items-center px-4 sm:px-6">
          <div className="flex items-center gap-4">
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
            <DesktopNavigation navbar={header.navbar} />
          </div>
          <div className="ml-auto">
            <DesktopCTAs rightCtas={header.rightCtas} onCtaClick={onCtaClick} />
          </div>
          <MobileMenu {...header} onCtaClick={onCtaClick} />
        </div>
      </div>
    </header>
  )
}
