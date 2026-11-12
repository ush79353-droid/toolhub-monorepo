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
