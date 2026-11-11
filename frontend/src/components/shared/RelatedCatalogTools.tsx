import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getToolBySlug } from '@/lib/sample-data';
import type { PublicRelatedTool } from '@/server/catalog/tools';
import { isApprovedComponentKey } from '@/tools/registry/keys';

interface RelatedCatalogToolsProps {
  tools: readonly PublicRelatedTool[];
  groupLabel: string;
  browseHref: string;
}

export function RelatedCatalogTools({
  tools,
  groupLabel,
  browseHref,
}: RelatedCatalogToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section
      id="related-calculators"
      aria-labelledby="related-calculators-heading"
      className="scroll-mt-24 rounded-2xl border border-border bg-white p-5 shadow-xs sm:p-6"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 id="related-calculators-heading" className="text-lg font-semibold text-accent">
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tools.map((tool) => {
          const isImplemented = tool.isActive && isApprovedComponentKey(tool.componentKey);
          const isPreviewRoute = !isImplemented && (tool.isActive || Boolean(getToolBySlug(tool.slug)));

          const body = (
            <div className="flex h-full flex-col justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium leading-snug text-accent group-hover:text-primary">
                  {tool.name}
                </h3>
                {tool.shortDescription && (
                  <p className="mt-1.5 line-clamp-2 text-xs font-normal leading-relaxed text-muted-foreground">
                    {tool.shortDescription}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-xs">
                <span className="font-normal text-muted-foreground">
                  {tool.pillarName || tool.categoryName}
                </span>
                {isImplemented ? (
                  <span className="inline-flex items-center font-medium text-primary">
                    Open
                    <ChevronRight className="ml-0.5 h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                ) : isPreviewRoute ? (
                  <span className="inline-flex items-center font-medium text-amber-700">
                    Preview only
                    <ChevronRight className="ml-0.5 h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="font-normal text-muted-foreground">Catalog only</span>
                )}
              </div>
            </div>
          );

          if (isImplemented || isPreviewRoute) {
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group block h-full rounded-xl border border-border bg-white p-4 transition-colors hover:border-primary/45 hover:bg-brand-softTeal/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {body}
              </Link>
            );
          }

          return (
            <div
              key={tool.id}
              className="h-full rounded-xl border border-dashed border-border bg-background/60 p-4"
            >
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
