import { Category } from '../categories/category.model';
import { Tool } from '../tools/tool.model';

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
