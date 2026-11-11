import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
            <Layers className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="related-calculators-heading"
              className="text-sm font-bold uppercase tracking-wider text-accent"
            >
              Related Calculators
            </h2>
            <p className="text-[11px] text-muted-foreground">
              From {groupLabel} • Live &amp; preview links open directly; catalog-only entries are
              planned
            </p>
          </div>
        </div>

        <Link href={browseHref} className="text-xs font-semibold text-primary hover:underline">
          Browse directory →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tools.map((tool) => {
          const isImplemented = tool.isActive && isApprovedComponentKey(tool.componentKey);
          const isPreviewRoute = !isImplemented && (tool.isActive || Boolean(getToolBySlug(tool.slug)));

          const statusBadge = isImplemented ? (
            <Badge variant="secondary" className="text-[10px] font-semibold">
              Live Calculator
            </Badge>
          ) : isPreviewRoute ? (
            <Badge className="border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-800 hover:bg-amber-50">
              Preview Only
            </Badge>
          ) : (
            <Badge variant="muted" className="text-[10px] font-semibold">
              Catalog Only
            </Badge>
          );

          const body = (
            <div className="flex h-full flex-col justify-between gap-2">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold leading-snug text-accent group-hover:text-primary sm:text-sm">
                    {tool.name}
                  </h3>
                  {statusBadge}
                </div>
                {tool.shortDescription && (
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                    {tool.shortDescription}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-muted-foreground">
                  {tool.pillarName || tool.categoryName}
                </span>
                {isImplemented || isPreviewRoute ? (
                  <span className="inline-flex items-center font-semibold text-primary">
                    Open
                    <ChevronRight className="ml-0.5 h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="font-medium text-muted-foreground">In development</span>
                )}
              </div>
            </div>
          );

          if (isImplemented || isPreviewRoute) {
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group block rounded-xl border border-border bg-white p-3.5 transition-colors hover:border-primary/50 hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {body}
              </Link>
            );
          }

          return (
            <div
              key={tool.id}
              className="rounded-xl border border-dashed border-border bg-background/60 p-3.5"
            >
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

