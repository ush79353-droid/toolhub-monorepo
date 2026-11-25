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
  | { kind: 'tools'; tools: SitemapToolRef[]; children: string[] }
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
        return [{ slug: subpillar.slug, segment: subpillar.slug, tools: rows }];
      });
      if (direct.length === 0 && subpillars.length === 0) return [];
      return [{ slug: pillar.slug, segment: pillar.slug, tools: direct, subpillars }];
    });
    if (tools.length === 0 && pillars.length === 0) return [];
    return [{ slug: category.slug, segment: segmentFor(category.slug, categoryReserved), tools, pillars }];
  });
}

function pillarBranch(categorySegment: string, pillar: SitemapPillarNode): string[] {
  const pillarFile = `${categorySegment}/${pillar.segment}.xml`;
  if (pillar.tools.length === 0 || pillar.subpillars.length === 0) return [pillarFile];
  return [
    pillarFile,
    ...pillar.subpillars.map((subpillar) => `${categorySegment}/${pillar.segment}/${subpillar.segment}.xml`),
  ];
}

export function sitemapIndexFiles(categories: readonly SitemapCategoryNode[]): string[] {
  const files = ['static.xml'];
  for (const category of categories) {
    files.push(`${category.segment}.xml`);
    if (category.tools.length === 0) continue;
    for (const pillar of category.pillars) files.push(...pillarBranch(category.segment, pillar));
  }
  return files;
}

function findCategory(categories: readonly SitemapCategoryNode[], segment: string): SitemapCategoryNode | undefined {
  return categories.find((category) => category.segment === segment);
}

function findPillar(category: SitemapCategoryNode, segment: string): SitemapPillarNode | undefined {
  return category.pillars.find((pillar) => pillar.segment === segment);
}

/** Tool pages are listed in the category or pillar file. A separate tools.xml is not created. */
export function resolveSitemapPath(categories: readonly SitemapCategoryNode[], parts: readonly string[]): SitemapMatch {
  const category = parts[0] ? findCategory(categories, parts[0]) : undefined;
  if (!category || parts.length > 3) return { kind: 'missing' };

  if (parts.length === 1) {
    if (category.tools.length === 0) {
      const files = category.pillars.flatMap((pillar) => pillarBranch(category.segment, pillar));
      return files.length > 0 ? { kind: 'index', files } : { kind: 'missing' };
    }
    return {
      kind: 'tools',
      tools: category.tools,
      children: category.pillars.map((pillar) => `${category.segment}/${pillar.segment}.xml`),
    };
  }

  const pillar = findPillar(category, parts[1] ?? '');
  if (!pillar || parts.length > 3) return { kind: 'missing' };

  if (parts.length === 2) {
    if (pillar.subpillars.length === 0) return { kind: 'tools', tools: pillar.tools, children: [] };
    if (pillar.tools.length === 0) {
      return {
        kind: 'index',
        files: pillar.subpillars.map((subpillar) => `${category.segment}/${pillar.segment}/${subpillar.segment}.xml`),
      };
    }
    return {
      kind: 'tools',
      tools: pillar.tools,
      children: pillar.subpillars.map((subpillar) => `${category.segment}/${pillar.segment}/${subpillar.segment}.xml`),
    };
  }

  const subpillar = pillar.subpillars.find((item) => item.segment === parts[2]);
  return subpillar ? { kind: 'tools', tools: subpillar.tools, children: [] } : { kind: 'missing' };
}
