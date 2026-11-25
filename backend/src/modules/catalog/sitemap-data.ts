import { Types } from 'mongoose';
import { Category } from '../categories/category.model';
import { SeoDraft } from '../seo/seo.model';
import { Tool } from '../tools/tool.model';

export interface PublicSitemapTool {
  slug: string;
  componentKey: string;
  publishedAt: string | null;
}

export interface PublicSitemapSubpillar {
  slug: string;
  tools: PublicSitemapTool[];
}

export interface PublicSitemapPillar {
  slug: string;
  tools: PublicSitemapTool[];
  subpillars: PublicSitemapSubpillar[];
}

export interface PublicSitemapCategory {
  slug: string;
  tools: PublicSitemapTool[];
  pillars: PublicSitemapPillar[];
}

export interface PublicSitemapHub {
  slug: string;
  updatedAt: string | null;
}

export interface PublicSitemap {
  hubs: PublicSitemapHub[];
  categories: PublicSitemapCategory[];
}

export interface SitemapGroupNode {
  id: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  name: string;
}

export interface SitemapGroupTool {
  slug: string;
  componentKey: string;
  publishedAt: string | null;
  categoryId: string;
  pillarId: string | null;
  subPillarId: string | null;
}

function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function byCatalogOrder(a: SitemapGroupNode, b: SitemapGroupNode): number {
  return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
}

function bySlug(a: PublicSitemapTool, b: PublicSitemapTool): number {
  return a.slug.localeCompare(b.slug);
}

/** Category, then pillar, then subpillar. A missing or inactive parent drops the tool one level up. */
export function groupSitemapTools(
  categories: SitemapGroupNode[],
  pillars: SitemapGroupNode[],
  subpillars: SitemapGroupNode[],
  tools: SitemapGroupTool[]
): PublicSitemapCategory[] {
  const categoryIds = new Set(categories.map((category) => category.id));
  const pillarsByCategory = new Map<string, SitemapGroupNode[]>();
  const pillarIds = new Set<string>();
  for (const pillar of pillars) {
    if (!pillar.parentId || !categoryIds.has(pillar.parentId)) continue;
    pillarIds.add(pillar.id);
    const list = pillarsByCategory.get(pillar.parentId) ?? [];
    list.push(pillar);
    pillarsByCategory.set(pillar.parentId, list);
  }

  const subsByPillar = new Map<string, SitemapGroupNode[]>();
  const subIds = new Set<string>();
  for (const subpillar of subpillars) {
    if (!subpillar.parentId || !pillarIds.has(subpillar.parentId)) continue;
    subIds.add(subpillar.id);
    const list = subsByPillar.get(subpillar.parentId) ?? [];
    list.push(subpillar);
    subsByPillar.set(subpillar.parentId, list);
  }

  const categoryTools = new Map<string, PublicSitemapTool[]>();
  const pillarTools = new Map<string, PublicSitemapTool[]>();
  const subTools = new Map<string, PublicSitemapTool[]>();
  const pillarById = new Map(pillars.filter((pillar) => pillarIds.has(pillar.id)).map((pillar) => [pillar.id, pillar]));
  const subById = new Map(
    subpillars.filter((subpillar) => subIds.has(subpillar.id)).map((subpillar) => [subpillar.id, subpillar])
  );

  for (const tool of tools) {
    if (!categoryIds.has(tool.categoryId) || !tool.slug) continue;
    const row: PublicSitemapTool = {
      slug: tool.slug,
      componentKey: tool.componentKey,
      publishedAt: tool.publishedAt,
    };
    const subpillar = tool.subPillarId ? subById.get(tool.subPillarId) : undefined;
    const subPillarParent = subpillar?.parentId ? pillarById.get(subpillar.parentId) : undefined;
    if (subpillar && subPillarParent?.parentId === tool.categoryId) {
      const list = subTools.get(subpillar.id) ?? [];
      list.push(row);
      subTools.set(subpillar.id, list);
      continue;
    }
    const pillar = tool.pillarId ? pillarById.get(tool.pillarId) : undefined;
    if (pillar?.parentId === tool.categoryId) {
      const list = pillarTools.get(pillar.id) ?? [];
      list.push(row);
      pillarTools.set(pillar.id, list);
      continue;
    }
    const list = categoryTools.get(tool.categoryId) ?? [];
    list.push(row);
    categoryTools.set(tool.categoryId, list);
  }

  return [...categories].sort(byCatalogOrder).flatMap((category) => {
    const loose = (categoryTools.get(category.id) ?? []).sort(bySlug);
    const groupedPillars = (pillarsByCategory.get(category.id) ?? []).sort(byCatalogOrder).flatMap((pillar) => {
      const direct = (pillarTools.get(pillar.id) ?? []).sort(bySlug);
      const groupedSubs = (subsByPillar.get(pillar.id) ?? []).sort(byCatalogOrder).flatMap((subpillar) => {
        const rows = (subTools.get(subpillar.id) ?? []).sort(bySlug);
        if (rows.length === 0) return [];
        return [{ slug: subpillar.slug, tools: rows }];
      });
      if (direct.length === 0 && groupedSubs.length === 0) return [];
      return [{ slug: pillar.slug, tools: direct, subpillars: groupedSubs }];
    });
    if (loose.length === 0 && groupedPillars.length === 0) return [];
    return [{ slug: category.slug, tools: loose, pillars: groupedPillars }];
  });
}

/** Active category hubs, plus published tools nested category → pillar → subpillar. */
export async function getPublicSitemap(): Promise<PublicSitemap> {
  const categoryDocs = await Category.find({ kind: 'category', isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .select('slug updatedAt sortOrder name')
    .lean<Array<{ _id: Types.ObjectId; slug: string; updatedAt?: Date; sortOrder?: number; name: string }>>();

  const hubs = categoryDocs.map((category) => ({
    slug: category.slug,
    updatedAt: iso(category.updatedAt),
  }));

  const published = await SeoDraft.aggregate<{
    _id: Types.ObjectId;
    publishedAt: Date | null;
    updatedAt: Date | null;
  }>([
    { $match: { status: 'published' } },
    { $sort: { publishedAt: -1, updatedAt: -1 } },
    {
      $group: {
        _id: '$toolId',
        publishedAt: { $first: '$publishedAt' },
        updatedAt: { $first: '$updatedAt' },
      },
    },
  ]);
  const publishedAt = new Map(
    published.map((row) => [String(row._id), iso(row.publishedAt) ?? iso(row.updatedAt)])
  );
  if (publishedAt.size === 0) return { hubs, categories: [] };

  const tools = await Tool.find({
    _id: { $in: [...publishedAt.keys()].map((id) => new Types.ObjectId(id)) },
    isActive: true,
    indexable: true,
    sitemapInclude: { $ne: false },
    componentKey: { $nin: [null, ''] },
  })
    .select('slug category pillar subPillar componentKey')
    .lean<
      Array<{
        _id: Types.ObjectId;
        slug: string;
        componentKey?: string;
        category?: Types.ObjectId | null;
        pillar?: Types.ObjectId | null;
        subPillar?: Types.ObjectId | null;
      }>
    >();

  const nodes = await Category.find({ kind: { $in: ['pillar', 'sub_pillar'] }, isActive: true })
    .select('slug kind parent sortOrder name')
    .lean<
      Array<{
        _id: Types.ObjectId;
        slug: string;
        kind: 'pillar' | 'sub_pillar';
        parent?: Types.ObjectId | null;
        sortOrder?: number;
        name: string;
      }>
    >();

  const toNode = (node: {
    _id: Types.ObjectId;
    slug: string;
    parent?: Types.ObjectId | null;
    sortOrder?: number;
    name: string;
  }): SitemapGroupNode => ({
    id: String(node._id),
    slug: node.slug,
    parentId: node.parent ? String(node.parent) : null,
    sortOrder: node.sortOrder ?? 0,
    name: node.name,
  });

  return {
    hubs,
    categories: groupSitemapTools(
      categoryDocs.map((category) => ({
        id: String(category._id),
        slug: category.slug,
        parentId: null,
        sortOrder: category.sortOrder ?? 0,
        name: category.name,
      })),
      nodes.filter((node) => node.kind === 'pillar').map(toNode),
      nodes.filter((node) => node.kind === 'sub_pillar').map(toNode),
      tools.flatMap((tool) => {
        if (!tool.category) return [];
        return [
          {
            slug: tool.slug,
            componentKey: tool.componentKey ?? '',
            publishedAt: publishedAt.get(String(tool._id)) ?? null,
            categoryId: String(tool.category),
            pillarId: tool.pillar ? String(tool.pillar) : null,
            subPillarId: tool.subPillar ? String(tool.subPillar) : null,
          },
        ];
      })
    ),
  };
}
