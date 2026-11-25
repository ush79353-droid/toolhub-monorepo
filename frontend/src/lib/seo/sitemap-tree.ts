export interface SitemapToolRef {
  slug: string;
  componentKey: string;
  publishedAt: string | null;
}

export interface SitemapSubpillarNode {
  slug: string;
  segment: string;
  tools: SitemapToolRef[];
}

export interface SitemapPillarNode {
  slug: string;
  segment: string;
  tools: SitemapToolRef[];
  subpillars: SitemapSubpillarNode[];
}

export interface SitemapCategoryNode {
  slug: string;
  segment: string;
  tools: SitemapToolRef[];
  pillars: SitemapPillarNode[];
}

interface RawSubpillar {
  slug: string;
  tools: SitemapToolRef[];
}

interface RawPillar {
  slug: string;
  tools: SitemapToolRef[];
  subpillars: RawSubpillar[];
}

export interface RawSitemapCategory {
  slug: string;
  tools: SitemapToolRef[];
  pillars: RawPillar[];
}

export type SitemapMatch =
  | { kind: 'index'; files: string[] }
  | { kind: 'tools'; tools: SitemapToolRef[] }
  | { kind: 'missing' };

function segmentFor(slug: string, reserved: ReadonlySet<string>): string {
  return reserved.has(slug) ? `section-${slug}` : slug;
}

/** Drop unregistered tools and any branch that has nothing left to list. */
export function prepareSitemapCategories(
  categories: RawSitemapCategory[],
  keep: (tool: SitemapToolRef) => boolean
): SitemapCategoryNode[] {
  const categoryReserved = new Set(['static']);
  const childReserved = new Set(['tools']);
  return categories.flatMap((category) => {
    if (!category.slug) return [];
    const tools = category.tools.filter((tool) => tool.slug && keep(tool));
    const pillars = (category.pillars ?? []).flatMap((pillar) => {
      if (!pillar.slug) return [];
      const direct = (pillar.tools ?? []).filter((tool) => tool.slug && keep(tool));
      const subpillars = (pillar.subpillars ?? []).flatMap((subpillar) => {
        if (!subpillar.slug) return [];
        const rows = (subpillar.tools ?? []).filter((tool) => tool.slug && keep(tool));
        if (rows.length === 0) return [];
        return [{ slug: subpillar.slug, segment: segmentFor(subpillar.slug, childReserved), tools: rows }];
      });
      if (direct.length === 0 && subpillars.length === 0) return [];
      return [{ slug: pillar.slug, segment: segmentFor(pillar.slug, childReserved), tools: direct, subpillars }];
    });
    if (tools.length === 0 && pillars.length === 0) return [];
    return [{ slug: category.slug, segment: segmentFor(category.slug, categoryReserved), tools, pillars }];
  });
}

export function sitemapIndexFiles(categories: readonly SitemapCategoryNode[]): string[] {
  return ['static.xml', ...categories.map((category) => `${category.segment}.xml`)];
}

function findCategory(categories: readonly SitemapCategoryNode[], segment: string): SitemapCategoryNode | undefined {
  return categories.find((category) => category.segment === segment);
}

function findPillar(category: SitemapCategoryNode, segment: string): SitemapPillarNode | undefined {
  return category.pillars.find((pillar) => pillar.segment === segment);
}

/** One file is either an index of child sitemaps or a urlset of tool pages. */
export function resolveSitemapPath(categories: readonly SitemapCategoryNode[], parts: readonly string[]): SitemapMatch {
  const category = parts[0] ? findCategory(categories, parts[0]) : undefined;
  if (!category || parts.length > 3) return { kind: 'missing' };

  if (parts.length === 1) {
    const files: string[] = [];
    if (category.tools.length > 0) files.push(`${category.segment}/tools.xml`);
    for (const pillar of category.pillars) files.push(`${category.segment}/${pillar.segment}.xml`);
    return files.length > 0 ? { kind: 'index', files } : { kind: 'missing' };
  }

  if (parts[1] === 'tools') {
    return parts.length === 2 && category.tools.length > 0 ? { kind: 'tools', tools: category.tools } : { kind: 'missing' };
  }

  const pillar = findPillar(category, parts[1] ?? '');
  if (!pillar) return { kind: 'missing' };

  if (parts.length === 2) {
    if (pillar.subpillars.length === 0) return { kind: 'tools', tools: pillar.tools };
    const files: string[] = [];
    if (pillar.tools.length > 0) files.push(`${category.segment}/${pillar.segment}/tools.xml`);
    for (const subpillar of pillar.subpillars) {
      files.push(`${category.segment}/${pillar.segment}/${subpillar.segment}.xml`);
    }
    return { kind: 'index', files };
  }

  if (parts[2] === 'tools') {
    return pillar.tools.length > 0 ? { kind: 'tools', tools: pillar.tools } : { kind: 'missing' };
  }

  const subpillar = pillar.subpillars.find((item) => item.segment === parts[2]);
  return subpillar ? { kind: 'tools', tools: subpillar.tools } : { kind: 'missing' };
}
