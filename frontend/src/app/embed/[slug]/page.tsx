import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EmbedResizeReporter } from '@/components/embed/EmbedResizeReporter';
import { ToolWorkspace } from '@/components/shared/ToolWorkspace';
import { siteConfig } from '@/config/site';
import {
  buildEmbedPath,
  buildToolPageUrl,
  isToolEmbedEligible,
} from '@/lib/embed/tool-embed';
import { getPublicToolBySlug } from '@/server/catalog/tools';
import { getPublicSiteOrigin } from '@/server/seo/public-site';
import { isApprovedComponentKey } from '@/tools/registry/keys';
import type { ToolMetadata } from '@/types/tool';

export const dynamic = 'force-dynamic';

interface EmbedPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ embedId?: string }>;
}

function toToolMetadata(tool: NonNullable<Awaited<ReturnType<typeof getPublicToolBySlug>>>): ToolMetadata {
  return {
    id: tool.id,
    slug: tool.slug,
    title: tool.name,
    description: tool.shortDescription || `${tool.name} on ${siteConfig.name}`,
    category: (tool.category?.slug as ToolMetadata['category']) || 'calculators',
    icon: 'calculator',
    version: '1.0.0',
    executionType: tool.executionType,
    componentKey: tool.componentKey,
    isActive: tool.isActive,
    tags: [],
  };
}

export async function generateMetadata({ params }: EmbedPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getPublicToolBySlug(slug);
  const siteUrl = getPublicSiteOrigin();
  const canonical = tool ? buildToolPageUrl(siteUrl, tool.slug) : undefined;

  return {
    title: tool ? `${tool.name} Embed` : 'Calculator Embed',
    description: 'Embedded calculator view. Not for search indexing.',
    robots: { index: false, follow: false, nocache: true },
    alternates: canonical ? { canonical } : undefined,
  };
}

export default async function EmbedToolPage({ params, searchParams }: EmbedPageProps) {
  const { slug } = await params;
  const { embedId: embedIdParam } = await searchParams;
  const tool = await getPublicToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const eligible = isToolEmbedEligible({
    embedEnabled: tool.embedEnabled,
    isActive: tool.isActive,
    componentKey: tool.componentKey,
    embedDefaultHeight: tool.embedDefaultHeight ?? 650,
    embedPreferredLayout: tool.embedPreferredLayout ?? 'responsive',
    embedAllowedDomains: tool.embedAllowedDomains ?? '',
  });

  const fullPageHref = `/tools/${tool.slug}`;
  const embedId = embedIdParam?.trim() || `embed-${tool.slug}`;

  if (!eligible || !isApprovedComponentKey(tool.componentKey)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <h1 className="text-lg font-semibold text-accent">Embedding unavailable</h1>
        <p className="text-sm text-muted-foreground">
          This calculator is not available for embedding.
        </p>
        {tool.isActive ? (
          <Link href={fullPageHref} className="text-sm font-medium text-primary hover:underline">
            Open full calculator →
          </Link>
        ) : null}
      </main>
    );
  }

  const metadata = toToolMetadata(tool);
  const compact = tool.embedPreferredLayout === 'compact';

  return (
    <main className={`mx-auto w-full max-w-3xl px-3 py-3 sm:px-4 sm:py-4 ${compact ? 'max-w-xl' : ''}`}>
      <EmbedResizeReporter embedId={embedId}>
        <header className="mb-3">
          <h1 className="text-lg font-semibold tracking-tight text-accent sm:text-xl">{tool.name}</h1>
          {tool.shortDescription ? (
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{tool.shortDescription}</p>
          ) : null}
        </header>

        <ToolWorkspace tool={metadata} presentation="embed" />

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <p>
            Powered by{' '}
            <Link href="/" className="font-medium text-primary hover:underline">
              {siteConfig.name}
            </Link>
          </p>
          <Link href={fullPageHref} className="font-medium text-primary hover:underline">
            Open full page →
          </Link>
        </footer>
        <span className="sr-only" data-embed-path={buildEmbedPath(tool.slug)} />
      </EmbedResizeReporter>
    </main>
  );
}
