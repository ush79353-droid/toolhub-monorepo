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
  keywords: string;
  indexable: boolean;
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

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface PublicToolListItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  categoryName: string;
  categorySlug: string;
}

export interface PublicToolListCategory {
  id: string;
  name: string;
  slug: string;
  toolCount: number;
}

export interface PublicToolList {
  items: PublicToolListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  categories: PublicToolListCategory[];
}

const PUBLIC_TOOL_PAGE_SIZE = 24;

interface PublicToolListRow {
  _id: { toString(): string };
  name: string;
  slug: string;
  shortDescription?: string;
  category?: { name?: string; slug?: string } | null;
}

export async function listPublicTools(query: {
  page?: unknown;
  q?: unknown;
  category?: unknown;
}): Promise<PublicToolList> {
  const page = Math.min(10_000, Math.max(1, Math.trunc(Number(query.page)) || 1));
  const q = typeof query.q === 'string' ? query.q.trim().slice(0, 120) : '';
  const categorySlug = typeof query.category === 'string' ? query.category.trim().toLowerCase() : '';
  const filter: Record<string, unknown> = { isActive: true };

  if (q) {
    const pattern = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ name: pattern }, { shortDescription: pattern }, { slug: pattern }];
  }

  const [activeCategories, counts] = await Promise.all([
    Category.find({ kind: 'category', isActive: true }).sort({ sortOrder: 1, name: 1 }).select('name slug'),
    Tool.aggregate<{ _id: unknown; count: number }>([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
  ]);
  const countByCategory = new Map(counts.map((row) => [String(row._id), row.count]));
  const categories = activeCategories
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      toolCount: countByCategory.get(category.id) ?? 0,
    }))
    .filter((category) => category.toolCount > 0);

  if (categorySlug) {
    const category = activeCategories.find((item) => item.slug === categorySlug);
    if (!category) {
      return { items: [], page: 1, limit: PUBLIC_TOOL_PAGE_SIZE, total: 0, totalPages: 1, categories };
    }
    filter.category = category._id;
  }

  const total = await Tool.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / PUBLIC_TOOL_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const rows = await Tool.find(filter)
    .select('name slug shortDescription category')
    .sort({ name: 1 })
    .skip((safePage - 1) * PUBLIC_TOOL_PAGE_SIZE)
    .limit(PUBLIC_TOOL_PAGE_SIZE)
    .populate('category', 'name slug')
    .lean<PublicToolListRow[]>();

  return {
    items: rows.map((row) => ({
      id: row._id.toString(),
      name: row.name,
      slug: row.slug,
      shortDescription: row.shortDescription ?? '',
      categoryName: row.category?.name ?? '',
      categorySlug: row.category?.slug ?? '',
    })),
    page: safePage,
    limit: PUBLIC_TOOL_PAGE_SIZE,
    total,
    totalPages,
    categories,
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
        })
          .select('name slug shortDescription iconUrl componentKey isActive isFeatured category pillar')
          .sort({ isActive: -1, isFeatured: -1, name: 1 })
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
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    canonicalUrl: doc.canonicalUrl,
    ogTitle: doc.ogTitle,
    ogDescription: doc.ogDescription,
    keywords: doc.keywords,
    indexable: doc.indexable,
    isFeatured: doc.isFeatured,
    updatedAt: doc.updatedAt.toISOString(),
  };
}
