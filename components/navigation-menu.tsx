"use client"
import * as React from "react"
import clsx from "clsx"
import Link from "next/link"
import { ChevronDownIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink as NavigationMenuLinkPrimitive,
  NavigationMenuList,
  NavigationMenuTrigger,
  type NavigationMenuLinkProps,
} from "@radix-ui/react-navigation-menu"
import { $button, ButtonLink } from "../common/button"
import type { HeaderFragment, HeaderLiksFragment } from "../lib/basehub/fragments"
import { useToggleState } from "../hooks/use-toggle-state"
import { useHasRendered } from "../hooks/use-has-rendered"

// #region desktop 💻
/* -------------------------------------------------------------------------- */
/*                                   Desktop                                  */
/* -------------------------------------------------------------------------- */

export function NavigationMenuHeader({
  links,
  className,
}: {
  links: HeaderLiksFragment[]
  className?: string
}) {
  // Filter out Blog, Changelog, and Site Setup, and treat Features as a regular link
  const filteredLinks = links.filter(link => 
    link._title !== "Blog" && link._title !== "Changelog" && link._title !== "Site Setup"
  ).map(link => {
    // Convert Features to a regular scroll link
    if (link._title === "Features") {
      return { ...link, href: "#features", sublinks: { items: [] } }
    }
    return link
  })
  
  return (
    <NavigationMenu className={clsx("z-1 relative flex-col justify-center lg:flex", className)} delayDuration={50}>
      <NavigationMenuList className="flex flex-1 gap-0.5 px-4">
        {filteredLinks.map((link) =>
          link.sublinks.items.length > 0 ? (
            <NavigationMenuLinkWithMenu key={link._id} {...link} />
          ) : (
            <li key={link._id}>
              <NavigationMenuLink href={link.href ?? "#"}>{link._title}</NavigationMenuLink>
            </li>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function NavigationMenuLink({
  className,
  children,
  href,
  ...props
}: { children: React.ReactNode; href: string } & NavigationMenuLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    const isHomepage = window.location.pathname === "/"
    
    // Handle Features link
    if (children === "Features" || href === "#features") {
      e.preventDefault()
      if (isHomepage) {
        // If on homepage, just scroll
        const featuresSection = document.querySelector('[data-section="features"]')
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        // If on another page, navigate to homepage with hash
        window.location.href = "/#features"
      }
    } 
    // Handle Pricing link
    else if (children === "Pricing" || href === "#pricing") {
      e.preventDefault()
      if (isHomepage) {
        // If on homepage, just scroll
        const pricingSection = document.getElementById("pricing-section")
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        // If on another page, navigate to homepage with hash
        window.location.href = "/#pricing-section"
      }
    }
  }

  return (
    <NavigationMenuLinkPrimitive
      className={$button({
        className:
          "inline-flex h-6 shrink-0 items-center justify-center gap-1 rounded-full px-3 pb-px tracking-tight hover:bg-[--surface-tertiary] dark:hover:bg-[--dark-surface-tertiary] lg:h-7",
      })}
      href={href}
      onClick={handleClick}
      {...props}
    >
      {children}
    </NavigationMenuLinkPrimitive>
  )
}

function NavigationMenuLinkWithMenu({ _title, href, sublinks }: HeaderLiksFragment) {
  const [closeOnClick, setCloseOnClick] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setCloseOnClick(true)
    }, 500)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current!)
    setCloseOnClick(false)
  }

  return (
    <NavigationMenuItem key={`${href ?? ""}${_title}`} className="relative items-center gap-0.5">
      <NavigationMenuTrigger
        onClick={(e) => {
          if (!closeOnClick) {
            e.preventDefault()
          }
        }}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
        className={$button({
          className:
            "inline-flex items-center gap-1 rounded-full pb-px pl-3 pr-2 tracking-tight hover:bg-[--surface-tertiary] dark:hover:bg-[--dark-surface-tertiary] lg:h-7",
        })}
      >
        {href ? <Link href={href}>{_title}</Link> : <span className="cursor-default">{_title}</span>}
        <ChevronDownIcon className="text-[--text-tertiary] dark:text-[--dark-text-tertiary]" />
      </NavigationMenuTrigger>
      <NavigationMenuContent className="absolute top-[calc(100%+4px)] w-[clamp(180px,30vw,300px)] rounded-md border border-[--border] bg-[--surface-primary] p-0.5 dark:border-[--dark-border] dark:bg-[--dark-surface-primary]">
        <div className="flex flex-col gap-1">
          <ul className="flex flex-col">
            {sublinks.items.map((sublink) => {
              const { href, _title } =
                sublink.link.__typename === "PageReferenceComponent"
                  ? {
                      href: sublink.link.page.pathname,
                      _title: sublink.link.page._title,
                    }
                  : {
                      href: sublink.link.text,
                      _title: sublink._title,
                    }

              return (
                <li key={sublink._id}>
                  <NavigationMenuLinkPrimitive
                    href={href}
                    className={$button({
                      className:
                        "flex w-full items-center gap-2 rounded-md px-3 py-1.5 hover:bg-[--surface-tertiary] dark:hover:bg-[--dark-surface-tertiary]",
                    })}
                  >
                    {_title}
                  </NavigationMenuLinkPrimitive>
                </li>
              )
            })}
          </ul>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export function DesktopNavigation({ navbar }: Pick<HeaderFragment, 'navbar'>) {
  return <NavigationMenuHeader className="hidden lg:flex" links={navbar.items} />
}

export function DesktopCTAs({ rightCtas, onCtaClick }: Pick<HeaderFragment, 'rightCtas'> & { onCtaClick?: () => void }) {
  return (
    <div className="hidden lg:flex items-center gap-2">
      <ButtonLink 
        className="!px-3.5" 
        href="/sign-in" 
        intent="secondary"
      >
        Log In
      </ButtonLink>
      <button
        onClick={() => {
          console.log('Header Get Started clicked');
          onCtaClick?.();
        }}
        className="gap-1 font-normal shrink-0 rounded-full ring-[--control] focus-visible:ring-2 outline-hidden outline-0 bg-[--accent-500] hover:bg-[--accent-600] text-[--text-on-accent-primary] border-[--accent-600] inline-flex items-center justify-center px-3.5 text-sm h-8 md:px-5 !px-3.5"
      >
        Get Started Today
      </button>
    </div>
  )
}

export function DesktopMenu({ navbar, rightCtas }: HeaderFragment) {
  return (
    <>
      <DesktopNavigation navbar={navbar} />
      <DesktopCTAs rightCtas={rightCtas} />
    </>
  )
}

// #region mobile 📱
/* -------------------------------------------------------------------------- */
/*                                   Mobile                                   */
/* -------------------------------------------------------------------------- */

export function MobileMenu({ navbar, rightCtas, onCtaClick }: HeaderFragment & { onCtaClick?: () => void }) {
  const { handleToggle, isOn, handleOff } = useToggleState()

  const handleMobileClick = (href: string, title?: string) => {
    const isHomepage = window.location.pathname === "/"

    if (isHomepage && (title === "Features" || href === "#features")) {
      const featuresSection = document.querySelector('[data-section="features"]')
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: "smooth" })
      }
    } else if (isHomepage && (title === "Pricing" || href === "#pricing")) {
      const pricingSection = document.getElementById("pricing-section")
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" })
      }
    } else if (href === "#features") {
      const featuresSection = document.querySelector('[data-section="features"]')
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: "smooth" })
      }
    } else if (href === "#pricing") {
      const pricingSection = document.getElementById("pricing-section")
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" })
      }
    }
    handleOff()
  }
  
  // Filter out Blog, Changelog, and Site Setup, and convert Features to simple link
  const filteredLinks = navbar.items.filter(link => 
    link._title !== "Blog" && link._title !== "Changelog" && link._title !== "Site Setup"
  ).map(link => {
    if (link._title === "Features") {
      return { ...link, href: "#features", sublinks: { items: [] } }
    }
    return link
  })

  return (
    <>
      <button
        aria-label="Toggle Menu"
        className="col-start-3 flex items-center justify-center gap-2 !justify-self-end rounded-sm border border-[--border] bg-[--surface-secondary] p-2 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary] lg:hidden lg:h-7"
        onPointerDown={handleToggle}
      >
        <HamburgerMenuIcon className="size-4" />
      </button>
      <div className="block lg:hidden">
        {isOn ? (
          <div className="fixed left-0 top-[calc(var(--header-height)+1px)] z-10 h-auto w-full bg-[--surface-primary] dark:bg-[--dark-surface-primary]">
            <div className="flex flex-col gap-8 px-6 py-8">
              <nav className="flex flex-col gap-4">
                {filteredLinks.map((link) =>
                  link.sublinks.items.length > 0 ? (
                    <ItemWithSublinks
                      key={link._id}
                      _id={link._id}
                      _title={link._title}
                      sublinks={link.sublinks.items}
                      onClick={handleOff}
                    />
                  ) : (
                    <button
                      key={link._id}
                      className="flex items-center gap-2 rounded-sm px-3 py-1.5 text-left"
                      onClick={() => handleMobileClick(link.href ?? "#", link._title)}
                    >
                      {link._title}
                    </button>
                  ),
                )}
                <Link
                  href="/community"
                  className="flex items-center gap-2 rounded-sm px-3 py-1.5 text-left"
                  onClick={handleOff}
                >
                  Community
                </Link>
              </nav>
              <div className="flex items-center justify-start gap-2">
                <ButtonLink href="/sign-in" intent="secondary" size="lg">
                  Log In
                </ButtonLink>
                <button
                  onClick={() => {
                    onCtaClick?.()
                    handleOff()
                  }}
                  className={$button({ intent: "primary", size: "lg", className: "w-full" })}
                >
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

function ItemWithSublinks({
  _id,
  _title,
  sublinks,
  onClick,
}: {
  _id: string
  _title: string
  sublinks: HeaderLiksFragment["sublinks"]["items"]
  onClick: () => void
}) {
  const { isOn, handleOff, handleOn } = useToggleState(false)
  const hasRendered = useHasRendered()
  const listRef = React.useRef<HTMLUListElement>(null)

  React.useEffect(() => {
    if (!hasRendered) return

    if (isOn) {
      listRef.current?.animate([{ height: `${(40 * sublinks.length).toString()}px` }], {
        duration: 200,
        easing: "ease-in-out",
        fill: "forwards",
      })
    } else {
      listRef.current?.animate([{ height: "0px" }], {
        duration: 200,
        easing: "ease-in-out",
        fill: "forwards",
      })
    }
  }, [isOn, hasRendered, sublinks])

  const handleToggle = () => {
    if (isOn) {
      handleOff()
    } else {
      handleOn()
    }
  }

  return (
    <div key={_id}>
      <button className="flex items-center gap-2 px-3 py-1.5" onClick={handleToggle}>
        {_title}
        <ChevronDownIcon
          className={clsx(
            "h-min transform text-[--text-tertiary] transition-transform dark:text-[--dark-text-tertiary]",
            isOn ? "rotate-180" : "rotate-0",
          )}
        />
      </button>
      <ul
        ref={listRef}
        className={clsx("flex h-0 origin-top transform-gpu flex-col gap-2 overflow-hidden pl-4 transition-transform")}
      >
        {sublinks.map((sublink) => {
          const { href, _title } =
            sublink.link.__typename === "PageReferenceComponent"
              ? {
                  href: sublink.link.page.pathname,
                  _title: sublink.link.page._title,
                }
              : {
                  href: sublink.link.text,
                  _title: sublink._title,
                }

          return (
            <li key={sublink._id}>
              <Link
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[--text-tertiary] dark:text-[--dark-text-tertiary]"
                href={href}
                onClick={onClick}
              >
                {_title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
