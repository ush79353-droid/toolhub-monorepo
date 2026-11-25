import { Types } from 'mongoose';
import { Category } from '../categories/category.model';
import { SeoDraft } from '../seo/seo.model';
import { Tool } from '../tools/tool.model';

export interface PublicSitemapTool {
  slug: string;
  componentKey: string;
  publishedAt: string | null;
}

export interface PublicSitemapPillar {
  slug: string;
  updatedAt: string | null;
  categorySlug: string;
  tools: PublicSitemapTool[];
}

export interface PublicSitemapCategory {
  slug: string;
  updatedAt: string | null;
}

export interface PublicSitemap {
  categories: PublicSitemapCategory[];
  pillars: PublicSitemapPillar[];
  unassigned: PublicSitemapTool[];
}

function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** Active, indexable tools whose SEO draft is published, grouped by pillar. */
export async function getPublicSitemap(): Promise<PublicSitemap> {
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

  const categories = await Category.find({ kind: 'category', isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .select('slug updatedAt')
    .lean<Array<{ _id: Types.ObjectId; slug: string; updatedAt?: Date }>>();

  if (publishedAt.size === 0) {
    return {
      categories: categories.map((category) => ({ slug: category.slug, updatedAt: iso(category.updatedAt) })),
      pillars: [],
      unassigned: [],
    };
  }

  const tools = await Tool.find({
    _id: { $in: [...publishedAt.keys()].map((id) => new Types.ObjectId(id)) },
    isActive: true,
    indexable: true,
    sitemapInclude: { $ne: false },
    componentKey: { $nin: [null, ''] },
  })
    .select('slug pillar componentKey')
    .lean<Array<{ _id: Types.ObjectId; slug: string; componentKey?: string; pillar?: Types.ObjectId | null }>>();

  const pillarIds = [...new Set(tools.flatMap((tool) => (tool.pillar ? [String(tool.pillar)] : [])))];
  const pillarDocs = await Category.find({ _id: { $in: pillarIds }, kind: 'pillar' })
    .select('slug updatedAt parent')
    .lean<Array<{ _id: Types.ObjectId; slug: string; updatedAt?: Date; parent?: Types.ObjectId | null }>>();
  const parentIds = pillarDocs.flatMap((pillar) => (pillar.parent ? [pillar.parent] : []));
  const parents = await Category.find({ _id: { $in: parentIds }, kind: 'category', isActive: true })
    .select('slug')
    .lean<Array<{ _id: Types.ObjectId; slug: string }>>();
  const parentSlug = new Map(parents.map((parent) => [String(parent._id), parent.slug]));
  const pillarById = new Map(pillarDocs.map((pillar) => [String(pillar._id), pillar]));

  const grouped = new Map<string, PublicSitemapTool[]>();
  const unassigned: PublicSitemapTool[] = [];
  for (const tool of tools) {
    const row: PublicSitemapTool = {
      slug: tool.slug,
      componentKey: tool.componentKey ?? '',
      publishedAt: publishedAt.get(String(tool._id)) ?? null,
    };
    const pillar = tool.pillar ? pillarById.get(String(tool.pillar)) : undefined;
    if (!pillar) {
      unassigned.push(row);
      continue;
    }
    const list = grouped.get(String(pillar._id)) ?? [];
    list.push(row);
    grouped.set(String(pillar._id), list);
  }

  const pillars = [...grouped.entries()]
    .map(([id, rows]) => {
      const pillar = pillarById.get(id);
      return {
        slug: pillar?.slug ?? id,
        updatedAt: iso(pillar?.updatedAt),
        categorySlug: pillar?.parent ? (parentSlug.get(String(pillar.parent)) ?? '') : '',
        tools: rows.sort((a, b) => a.slug.localeCompare(b.slug)),
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  unassigned.sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    categories: categories.map((category) => ({ slug: category.slug, updatedAt: iso(category.updatedAt) })),
    pillars,
    unassigned,
  };
}
