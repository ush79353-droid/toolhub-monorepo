import { siteConfig } from '@/config/site';
import { buildLlmsTxt, type LlmsTool } from '@/lib/seo/llms-txt';
import { getPublicCategories, getPublicCategoryDetail, type PublicCategoryTool } from '@/server/catalog/categories';
import { getPublicSiteOrigin } from '@/server/seo/public-site';
import { isRegisteredComponentKey } from '@/tools/registry/keys';

export const dynamic = 'force-dynamic';

function liveTools(tools: PublicCategoryTool[]): PublicCategoryTool[] {
  return tools.filter((tool) => tool.isActive && tool.slug && isRegisteredComponentKey(tool.componentKey));
}

export async function GET(): Promise<Response> {
  const origin = getPublicSiteOrigin().replace(/\/+$/, '');
  const categories = await getPublicCategories();
  const details = await Promise.all(categories.map((category) => getPublicCategoryDetail(category.slug)));

  const tools: LlmsTool[] = [];
  for (const detail of details) {
    if (!detail) continue;
    const rows = [
      ...liveTools(detail.ungrouped),
      ...detail.pillars.flatMap((pillar) => [
        ...liveTools(pillar.tools),
        ...pillar.subPillars.flatMap((subpillar) => liveTools(subpillar.tools)),
      ]),
    ];
    for (const tool of rows) {
      tools.push({
        name: tool.name,
        slug: tool.slug,
        shortDescription: tool.shortDescription,
        categorySlug: detail.slug,
      });
    }
  }

  const body = buildLlmsTxt({
    origin,
    siteName: siteConfig.name,
    categories: categories.map((category) => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
    })),
    tools,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
