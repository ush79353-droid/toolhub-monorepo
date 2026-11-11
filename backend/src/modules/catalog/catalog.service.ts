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

  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    shortDescription: doc.shortDescription,
    iconUrl: doc.iconUrl,
    executionType: doc.executionType ?? 'client',
    componentKey: doc.componentKey ?? '',
    category: asPublicRef(doc.category),
    pillar: asPublicRef(doc.pillar),
    subPillar: asPublicRef(doc.subPillar),
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
