"use client";

import * as React from "react";

import type { QuoteFragment } from "../../../lib/basehub/fragments";
import { cx } from "class-variance-authority";
import { BaseHubImage } from "basehub/next-image";
import GlareHover from "../../../components/GlareHover";

export function TestimonialsGridClient({ quotes }: { quotes: QuoteFragment[] }) {
  return (
    <div className="relative overflow-hidden md:columns-3">
      {quotes.map(({ quote, author, _id }) => (
        <GlareHover
          key={_id}
          width="100%"
          height="auto"
          background="transparent"
          borderRadius="12px"
          borderColor="transparent"
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={800}
          playOnce={false}
          className="mb-8 break-inside-avoid"
          style={{ width: '100%', height: 'auto' }}
        >
          <article
            className={cx(
              "overflow-hidden rounded-xl border border-[--border] dark:border-[--dark-border] bg-background dark:bg-background w-full"
            )}
          >
            <div className="flex items-start border-b border-[--border] p-5 dark:border-[--dark-border]">
              <blockquote className="text-pretty text-base font-light text-[--text-secondary] dark:text-[--dark-text-secondary] md:text-lg">
                {quote}
              </blockquote>
            </div>
            <div className="flex items-center bg-[--surface-secondary] px-4 py-3 dark:bg-[--dark-surface-secondary]">
              <div className="flex flex-1 flex-col gap-0.5">
                <h5 className="text-xs font-medium text-[--text-tertiary] dark:text-[--dark-text-tertiary] md:text-sm">
                  {author._title}
                </h5>
                <p className="text-pretty text-xs text-[--text-tertiary] dark:text-[--dark-text-tertiary] md:text-sm">
                  {author.role}, {author.company._title}
                </p>
              </div>
              {author.image && (
                <div className="pl-4">
                  <figure className="aspect-square size-8 rounded-full">
                    <BaseHubImage
                      alt={author.image.alt ?? author._title}
                      className="size-8 rounded-full"
                      src={author.image.url}
                      width={32}
                      height={32}
                    />
                  </figure>
                </div>
              )}
            </div>
          </article>
        </GlareHover>
      ))}
    </div>
  );
}
