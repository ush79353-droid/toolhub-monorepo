import * as React from 'react';
import Link from 'next/link';
import type { PublicRelatedTool } from '@/server/catalog/tools';
import { isApprovedComponentKey } from '@/tools/registry/keys';

interface RelatedCatalogToolsProps {
  tools: readonly PublicRelatedTool[];
  groupLabel: string;
  browseHref: string;
  /** When false, render bare section content for embedding inside a parent card. */
  framed?: boolean;
}

export function RelatedCatalogTools({
  tools,
  groupLabel,
  browseHref,
  framed = true,
}: RelatedCatalogToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section
      id="related-calculators"
      aria-labelledby="related-calculators-heading"
      className={
        framed
          ? 'scroll-mt-24 rounded-2xl border border-border bg-white p-5 shadow-xs sm:p-6'
          : 'scroll-mt-24'
      }
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2
            id="related-calculators-heading"
            className="text-lg font-semibold tracking-tight text-accent sm:text-xl"
          >
            Related Calculators
          </h2>
          <p className="mt-0.5 text-xs font-normal text-muted-foreground">
            From {groupLabel} • Interactive links open directly; catalog-only tools are planned
          </p>
        </div>

        <Link href={browseHref} className="text-xs font-medium text-primary hover:underline">
          Browse directory →
        </Link>
      </div>

      <ul className="list-disc space-y-1.5 pl-5">
        {tools.map((tool) => {
          const isImplemented = tool.isActive && isApprovedComponentKey(tool.componentKey);
          const group = tool.pillarName || tool.categoryName;

          // Only link implemented calculators — avoid crawl/UX paths into empty catalog shells.
          if (isImplemented) {
            return (
              <li key={tool.id} className="marker:text-muted-foreground">
                <Link
                  href={`/tools/${tool.slug}`}
                  className="text-sm font-normal text-foreground/90 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {tool.name}
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    · Open
                    {group ? ` · ${group}` : ''}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={tool.id} className="marker:text-muted-foreground">
              <span className="text-sm font-normal text-muted-foreground">
                {tool.name}
                <span className="ml-1.5 text-xs">
                  · Coming soon
                  {group ? ` · ${group}` : ''}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
