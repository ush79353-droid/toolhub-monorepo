import { AppError } from '../../middleware/error.middleware';
import type { ToolExecutionType } from '../../types/tool';
import { Category } from '../categories/category.model';
import { Tool } from '../tools/tool.model';
import { isToolSlug } from '../tools/tool.key';

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  toolCount: number;
}

export interface PublicFeaturedTool {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  iconUrl: string;
  categoryName: string;
  categorySlug: string;
}

export interface PublicToolRef {
  id: string;
  name: string;
  slug: string;
}

export interface PublicRelatedTool {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  iconUrl: string;
  componentKey: string;
  isActive: boolean;
  isFeatured: boolean;
  categoryName: string;
  categorySlug: string;
  pillarName: string;
}

export interface PublicToolDetail {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  iconUrl: string;
  executionType: ToolExecutionType;
  componentKey: string;
  category: PublicToolRef | null;
  pillar: PublicToolRef | null;
  subPillar: PublicToolRef | null;
  relatedTools: PublicRelatedTool[];
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  ogImageAlt: string;
  ogType: string;
  ogSiteName: string;
  keywords: string;
  indexable: boolean;
  robotsFollow: boolean;
  robotsNoArchive: boolean;
  robotsNoSnippet: boolean;
  robotsNoImageIndex: boolean;
  robotsMaxSnippet: number | null;
  robotsMaxImagePreview: string;
  robotsMaxVideoPreview: number | null;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageUrl: string;
  twitterImageAlt: string;
  twitterSite: string;
  schemaType: string;
  includeFaqSchema: boolean;
  sitemapInclude: boolean;
  sitemapPriority: number | null;
  sitemapChangeFrequency: string;
  embedEnabled: boolean;
  embedDefaultHeight: number;
  embedPreferredLayout: string;
  embedAllowedDomains: string;
  isActive: boolean;
  isFeatured: boolean;
  updatedAt: string;
}

function asPublicRef(value: unknown): PublicToolRef | null {
  if (!value || typeof value !== 'object' || !('name' in value)) return null;
  const doc = value as { id?: string; _id?: { toString(): string }; name: string; slug: string };
  return { id: doc.id || String(doc._id), name: doc.name, slug: doc.slug };
}

interface PopulatedRelatedDoc {
  _id: { toString(): string };
  id?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  iconUrl?: string;
  componentKey?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  category?: { name?: string; slug?: string } | null;
  pillar?: { name?: string } | null;
}

function toRelatedTool(doc: PopulatedRelatedDoc): PublicRelatedTool {
  return {
    id: doc.id || doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    shortDescription: doc.shortDescription ?? '',
    iconUrl: doc.iconUrl ?? '',
    componentKey: doc.componentKey ?? '',
    isActive: Boolean(doc.isActive),
    isFeatured: Boolean(doc.isFeatured),
    categoryName: doc.category?.name ?? '',
    categorySlug: doc.category?.slug ?? '',
    pillarName: doc.pillar?.name ?? '',
  };
}

export async function listPublicCategories(): Promise<PublicCategory[]> {
  const [categories, counts] = await Promise.all([
    Category.find({ kind: 'category', isActive: true }).sort({ sortOrder: 1, name: 1 }),
    Tool.aggregate<{ _id: unknown; count: number }>([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);
  const countByCategory = new Map(counts.map((row) => [String(row._id), row.count]));
  return categories.map((doc) => ({
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    iconUrl: doc.iconUrl ?? '',
    toolCount: countByCategory.get(doc.id) ?? 0,
  }));
}

export interface PublicCategoryTool {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  isActive: boolean;
}

export interface PublicSubPillarGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  tools: PublicCategoryTool[];
}

export interface PublicPillarGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  tools: PublicCategoryTool[];
  subPillars: PublicSubPillarGroup[];
}

export interface PublicCategoryDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  toolCount: number;
  pillars: PublicPillarGroup[];
  ungrouped: PublicCategoryTool[];
}

interface CategoryToolRow {
  _id: { toString(): string };
  name: string;
  slug: string;
  shortDescription?: string;
  isActive?: boolean;
  pillar?: { toString(): string } | null;
  subPillar?: { toString(): string } | null;
}

function toCategoryTool(row: CategoryToolRow): PublicCategoryTool {
  return {
    id: row._id.toString(),
    name: row.name,
    slug: row.slug,
    shortDescription: row.shortDescription ?? '',
    isActive: Boolean(row.isActive),
  };
}

export async function getPublicCategoryBySlug(rawSlug: string): Promise<PublicCategoryDetail> {
  const slug = rawSlug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new AppError('Category not found.', 404, 'NOT_FOUND');
  }

  const category = await Category.findOne({ slug, kind: 'category', isActive: true });
  if (!category) throw new AppError('Category not found.', 404, 'NOT_FOUND');

  const pillars = await Category.find({ parent: category._id, kind: 'pillar', isActive: true }).sort({
    sortOrder: 1,
    name: 1,
  });
  const subPillars = await Category.find({
    parent: { $in: pillars.map((pillar) => pillar._id) },
    kind: 'sub_pillar',
    isActive: true,
  }).sort({ sortOrder: 1, name: 1 });
  const tools = await Tool.find({ category: category._id, isActive: true })
    .select('name slug shortDescription isActive pillar subPillar')
    .sort({ name: 1 })
    .lean<CategoryToolRow[]>();

  const toolsBySubPillar = new Map<string, PublicCategoryTool[]>();
  const toolsByPillar = new Map<string, PublicCategoryTool[]>();
  const ungrouped: PublicCategoryTool[] = [];
  const pillarIds = new Set(pillars.map((pillar) => pillar.id));
  const subPillarIds = new Set(subPillars.map((subPillar) => subPillar.id));

  for (const row of tools) {
    const tool = toCategoryTool(row);
    const subPillarId = row.subPillar ? String(row.subPillar) : '';
    const pillarId = row.pillar ? String(row.pillar) : '';
    if (subPillarId && subPillarIds.has(subPillarId)) {
      const list = toolsBySubPillar.get(subPillarId) ?? [];
      list.push(tool);
      toolsBySubPillar.set(subPillarId, list);
    } else if (pillarId && pillarIds.has(pillarId)) {
      const list = toolsByPillar.get(pillarId) ?? [];
      list.push(tool);
      toolsByPillar.set(pillarId, list);
    } else {
      ungrouped.push(tool);
    }
  }

  const subPillarsByPillar = new Map<string, PublicSubPillarGroup[]>();
  for (const subPillar of subPillars) {
    const parentId = subPillar.parent ? String(subPillar.parent) : '';
    const group: PublicSubPillarGroup = {
      id: subPillar.id,
      name: subPillar.name,
      slug: subPillar.slug,
      description: subPillar.description,
      tools: toolsBySubPillar.get(subPillar.id) ?? [],
    };
    if (group.tools.length === 0) continue;
    const list = subPillarsByPillar.get(parentId) ?? [];
    list.push(group);
    subPillarsByPillar.set(parentId, list);
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    iconUrl: category.iconUrl ?? '',
    toolCount: tools.length,
    pillars: pillars
      .map((pillar) => ({
        id: pillar.id,
        name: pillar.name,
        slug: pillar.slug,
        description: pillar.description,
        tools: toolsByPillar.get(pillar.id) ?? [],
        subPillars: subPillarsByPillar.get(pillar.id) ?? [],
      }))
      .filter((pillar) => pillar.tools.length > 0 || pillar.subPillars.length > 0),
    ungrouped,
  };
}

export async function listFeaturedTools(): Promise<PublicFeaturedTool[]> {
  const docs = await Tool.find({ isFeatured: true }).sort({ name: 1 }).limit(12).populate('category', 'name slug');
  return docs.map((doc) => {
    const category = doc.category as unknown as { name?: string; slug?: string } | null;
    return {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      shortDescription: doc.shortDescription,
      iconUrl: doc.iconUrl,
      categoryName: category?.name ?? '',
      categorySlug: category?.slug ?? '',
    };
  });
}

export async function getPublicToolBySlug(rawSlug: string): Promise<PublicToolDetail> {
  const slug = rawSlug.trim().toLowerCase();
  if (!isToolSlug(slug)) {
    throw new AppError('Tool not found.', 404, 'NOT_FOUND');
  }

  const doc = await Tool.findOne({ slug, isActive: true }).populate(
    'category pillar subPillar',
    'name slug'
  );
  if (!doc) {
    throw new AppError('Tool not found.', 404, 'NOT_FOUND');
  }

  const categoryRef = asPublicRef(doc.category);
  const pillarRef = asPublicRef(doc.pillar);
  const subPillarRef = asPublicRef(doc.subPillar);

  const [featuredOrActiveSiblings, pillarSiblings] = await Promise.all([
    categoryRef
      ? Tool.find({
          category: categoryRef.id,
          _id: { $ne: doc._id },
          $or: [{ isActive: true }, { isFeatured: true }],
        })
          .select('name slug shortDescription iconUrl componentKey isActive isFeatured category pillar')
          .sort({ isActive: -1, isFeatured: -1, name: 1 })
          .limit(6)
          .populate('category pillar', 'name slug')
          .lean<PopulatedRelatedDoc[]>()
      : Promise.resolve([] as PopulatedRelatedDoc[]),
    pillarRef
      ? Tool.find({
          pillar: pillarRef.id,
          _id: { $ne: doc._id },
          isActive: true,
        })
          .select('name slug shortDescription iconUrl componentKey isActive isFeatured category pillar')
          .sort({ isFeatured: -1, name: 1 })
          .limit(6)
          .populate('category pillar', 'name slug')
          .lean<PopulatedRelatedDoc[]>()
      : Promise.resolve([] as PopulatedRelatedDoc[]),
  ]);

  const seenIds = new Set<string>();
  const relatedTools: PublicRelatedTool[] = [];
  for (const candidate of [...featuredOrActiveSiblings, ...pillarSiblings]) {
    const mapped = toRelatedTool(candidate);
    if (seenIds.has(mapped.id)) continue;
    seenIds.add(mapped.id);
    relatedTools.push(mapped);
    if (relatedTools.length >= 6) break;
  }

  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    shortDescription: doc.shortDescription,
    iconUrl: doc.iconUrl,
    executionType: doc.executionType ?? 'client',
    componentKey: doc.componentKey ?? '',
    category: categoryRef,
    pillar: pillarRef,
    subPillar: subPillarRef,
    relatedTools,
    metaTitle: doc.metaTitle ?? '',
    metaDescription: doc.metaDescription ?? '',
    canonicalUrl: doc.canonicalUrl ?? '',
    ogTitle: doc.ogTitle ?? '',
    ogDescription: doc.ogDescription ?? '',
    ogImageUrl: doc.ogImageUrl ?? '',
    ogImageAlt: doc.ogImageAlt ?? '',
    ogType: doc.ogType ?? '',
    ogSiteName: doc.ogSiteName ?? '',
    keywords: doc.keywords ?? '',
    indexable: doc.indexable ?? true,
    robotsFollow: doc.robotsFollow ?? true,
    robotsNoArchive: doc.robotsNoArchive ?? false,
    robotsNoSnippet: doc.robotsNoSnippet ?? false,
    robotsNoImageIndex: doc.robotsNoImageIndex ?? false,
    robotsMaxSnippet: doc.robotsMaxSnippet ?? null,
    robotsMaxImagePreview: doc.robotsMaxImagePreview ?? '',
    robotsMaxVideoPreview: doc.robotsMaxVideoPreview ?? null,
    twitterCard: doc.twitterCard ?? '',
    twitterTitle: doc.twitterTitle ?? '',
    twitterDescription: doc.twitterDescription ?? '',
    twitterImageUrl: doc.twitterImageUrl ?? '',
    twitterImageAlt: doc.twitterImageAlt ?? '',
    twitterSite: doc.twitterSite ?? '',
    schemaType: doc.schemaType ?? '',
    includeFaqSchema: doc.includeFaqSchema !== false,
    sitemapInclude: doc.sitemapInclude ?? true,
    sitemapPriority: doc.sitemapPriority ?? null,
    sitemapChangeFrequency: doc.sitemapChangeFrequency ?? '',
    embedEnabled: doc.embedEnabled !== false,
    embedDefaultHeight: doc.embedDefaultHeight ?? 650,
    embedPreferredLayout: doc.embedPreferredLayout ?? 'responsive',
    embedAllowedDomains: doc.embedAllowedDomains ?? '',
    isActive: doc.isActive ?? true,
    isFeatured: doc.isFeatured,
    updatedAt: doc.updatedAt.toISOString(),
  };
}
