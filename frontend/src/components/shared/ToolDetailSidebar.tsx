import Link from 'next/link';
import type { PublicRelatedTool } from '@/server/catalog/tools';
import { isApprovedComponentKey } from '@/tools/registry/keys';

export interface ToolDetailSidebarCountryRules {
  title: string;
  countries: readonly string[];
}

interface ToolDetailSidebarProps {
  groupLabel: string;
  browseHref: string;
  browseLabel: string;
  moreTools: readonly PublicRelatedTool[];
  otherTopicTools: readonly PublicRelatedTool[];
  countryRules?: ToolDetailSidebarCountryRules | null;
}

function ToolLink({ tool }: { tool: PublicRelatedTool }) {
  const isImplemented = tool.isActive && isApprovedComponentKey(tool.componentKey);

  if (isImplemented) {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className="block text-[15px] font-normal leading-snug text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {tool.name}
      </Link>
    );
  }

  return (
    <span className="block text-[15px] font-normal leading-snug text-muted-foreground">
      {tool.name}
    </span>
  );
}

/**
 * Right-rail widgets for two-column tool pages (More tools / Other topics / Country rules).
 */
export function ToolDetailSidebar({
  groupLabel,
  browseHref,
  browseLabel,
  moreTools,
  otherTopicTools,
  countryRules = null,
}: ToolDetailSidebarProps) {
  const hasMore = moreTools.length > 0;
  const hasOther = otherTopicTools.length > 0;
  const hasCountries = Boolean(countryRules && countryRules.countries.length > 0);

  if (!hasMore && !hasOther && !hasCountries) return null;

  return (
    <aside aria-label="Related tools and topics" className="space-y-4">
      {hasMore ? (
        <section className="rounded-2xl border border-border bg-white p-5 shadow-xs sm:p-6">
          <h2 className="text-base font-bold tracking-tight text-accent sm:text-lg">
            More {groupLabel.toLowerCase()} tools
          </h2>
          <ul className="mt-4 space-y-3">
            {moreTools.map((tool) => (
              <li key={tool.id}>
                <ToolLink tool={tool} />
              </li>
            ))}
          </ul>
          <Link
            href={browseHref}
            className="mt-5 inline-block text-sm font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {browseLabel}
          </Link>
        </section>
      ) : null}

      {hasOther ? (
        <section className="rounded-2xl border border-border bg-white p-5 shadow-xs sm:p-6">
          <h2 className="text-base font-bold tracking-tight text-accent sm:text-lg">
            Related in other topics
          </h2>
          <ul className="mt-4 space-y-4">
            {otherTopicTools.map((tool) => {
              const topic = tool.pillarName || tool.categoryName;
              const isImplemented = tool.isActive && isApprovedComponentKey(tool.componentKey);

              return (
                <li key={tool.id}>
                  {isImplemented ? (
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="block text-[15px] font-medium leading-snug text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {tool.name}
                    </Link>
                  ) : (
                    <span className="block text-[15px] font-medium leading-snug text-muted-foreground">
                      {tool.name}
                    </span>
                  )}
                  {topic ? (
                    <p className="mt-0.5 text-sm font-normal text-muted-foreground">{topic}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {hasCountries && countryRules ? (
        <section className="rounded-2xl bg-accent p-5 text-white shadow-xs sm:p-6">
          <h2 className="text-base font-bold tracking-tight sm:text-lg">{countryRules.title}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {countryRules.countries.map((country) => (
              <li key={country}>
                <span className="inline-flex rounded-full border border-white/70 px-3.5 py-1.5 text-sm font-normal text-white">
                  {country}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
