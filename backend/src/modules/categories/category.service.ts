import { slugify } from '../../utils/helpers';
import { AppError } from '../../middleware/error.middleware';
import {
  Category,
  type CategoryKind,
  type CategoryNode,
  type ICategory,
} from './category.model';
import type { CreateCategoryInput, UpdateCategoryInput } from '../../validation/category.schema';

const PARENT_KIND: Record<CategoryKind, CategoryKind | null> = {
  category: null,
  pillar: 'category',
  sub_pillar: 'pillar',
};

function toNode(doc: ICategory, children: CategoryNode[] = []): CategoryNode {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    kind: doc.kind,
    parentId: doc.parent ? String(doc.parent) : null,
    sortOrder: doc.sortOrder,
    description: doc.description,
    isActive: doc.isActive,
    children,
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function ensureSlug(raw: string, ignoreId?: string): Promise<string> {
  const slug = slugify(raw);
  if (!slug) throw new AppError('Slug is required', 400, 'VALIDATION_ERROR');
  const taken = await Category.exists({
    slug,
    ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
  });
  if (taken) throw new AppError('This slug is already in use', 409, 'SLUG_TAKEN');
  return slug;
}

async function assertParent(kind: CategoryKind, parentId?: string | null): Promise<string | null> {
  const expected = PARENT_KIND[kind];
  if (!expected) {
    if (parentId) {
      throw new AppError('A category cannot have a parent', 400, 'INVALID_PARENT');
    }
    return null;
  }
  if (!parentId) {
    throw new AppError(`A ${kind.replace('_', ' ')} needs a parent`, 400, 'PARENT_REQUIRED');
  }
  const parent = await Category.findById(parentId);
  if (!parent || parent.kind !== expected) {
    throw new AppError(
      `Parent must be a ${expected.replace('_', ' ')}`,
      400,
      'INVALID_PARENT'
    );
  }
  return parent.id;
}

export interface CategoryListResult {
  items: CategoryNode[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

async function assemble(roots: ICategory[]): Promise<CategoryNode[]> {
  const rootIds = roots.map((doc) => doc._id);
  const pillars = rootIds.length
    ? await Category.find({ parent: { $in: rootIds } }).sort({ sortOrder: 1, name: 1 })
    : [];
  const pillarIds = pillars.map((doc) => doc._id);
  const subs = pillarIds.length
    ? await Category.find({ parent: { $in: pillarIds } }).sort({ sortOrder: 1, name: 1 })
    : [];

  const nodes = new Map<string, CategoryNode>();
  for (const doc of [...roots, ...pillars, ...subs]) nodes.set(doc.id, toNode(doc));
  for (const doc of [...pillars, ...subs]) {
    const parent = doc.parent ? nodes.get(String(doc.parent)) : undefined;
    if (parent) parent.children.push(nodes.get(doc.id)!);
  }
  return roots.map((doc) => nodes.get(doc.id)!);
}

export async function listCategories(query: {
  page: number;
  limit: number;
  search?: string;
}): Promise<CategoryListResult> {
  const page = query.page;
  const limit = query.limit;
  let rootIds: string[] | null = null;

  if (query.search) {
    const hits = await Category.find({
      $or: [
        { name: new RegExp(escapeRegex(query.search), 'i') },
        { slug: new RegExp(escapeRegex(query.search), 'i') },
      ],
    }).select('_id parent kind');

    const resolved = new Set<string>();
    const pillarIds = hits.filter((hit) => hit.kind === 'sub_pillar' && hit.parent).map((hit) => hit.parent!);
    const pillars = pillarIds.length
      ? await Category.find({ _id: { $in: pillarIds } }).select('parent')
      : [];
    const pillarParent = new Map(pillars.map((doc) => [String(doc._id), doc.parent ? String(doc.parent) : null]));

    for (const hit of hits) {
      if (hit.kind === 'category') resolved.add(hit.id);
      else if (hit.kind === 'pillar' && hit.parent) resolved.add(String(hit.parent));
      else if (hit.kind === 'sub_pillar' && hit.parent) {
        const categoryId = pillarParent.get(String(hit.parent));
        if (categoryId) resolved.add(categoryId);
      }
    }
    rootIds = [...resolved];
  }

  const filter = {
    kind: 'category' as const,
    ...(rootIds ? { _id: { $in: rootIds } } : {}),
  };
  const total = await Category.countDocuments(filter);
  const roots = await Category.find(filter)
    .sort({ sortOrder: 1, name: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    items: await assemble(roots),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function listParentOptions(): Promise<Pick<CategoryNode, 'id' | 'name' | 'kind'>[]> {
  const docs = await Category.find({ kind: { $in: ['category', 'pillar'] } })
    .sort({ name: 1 })
    .select('name kind');
  return docs.map((doc) => ({ id: doc.id, name: doc.name, kind: doc.kind }));
}

export async function getCategory(id: string): Promise<CategoryNode> {
  const doc = await Category.findById(id);
  if (!doc) throw new AppError('Category not found', 404, 'NOT_FOUND');
  return toNode(doc);
}

export async function createCategory(input: CreateCategoryInput): Promise<CategoryNode> {
  const parentId = await assertParent(input.kind, input.parentId);
  const siblingCount = await Category.countDocuments({ parent: parentId });
  const doc = await Category.create({
    name: input.name.trim(),
    slug: await ensureSlug(input.slug || input.name),
    kind: input.kind,
    parent: parentId,
    sortOrder: input.sortOrder ?? siblingCount,
    description: input.description ?? '',
    isActive: input.isActive ?? true,
  });
  return toNode(doc);
}

export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<CategoryNode> {
  const doc = await Category.findById(id);
  if (!doc) throw new AppError('Category not found', 404, 'NOT_FOUND');

  if (input.name) doc.name = input.name;
  if (input.slug) doc.slug = await ensureSlug(input.slug, doc.id);
  if (input.description !== undefined) doc.description = input.description;
  if (input.sortOrder !== undefined) doc.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) doc.isActive = input.isActive;
  await doc.save();
  return toNode(doc);
}

export async function deleteCategory(id: string): Promise<{ deleted: number }> {
  const doc = await Category.findById(id);
  if (!doc) throw new AppError('Category not found', 404, 'NOT_FOUND');

  const pillarIds =
    doc.kind === 'category'
      ? (await Category.find({ parent: doc._id }).select('_id')).map((item) => item._id)
      : doc.kind === 'pillar'
        ? [doc._id]
        : [];

  const subIds = pillarIds.length
    ? (await Category.find({ parent: { $in: pillarIds } }).select('_id')).map((item) => item._id)
    : [];

  const ids = [doc._id, ...pillarIds, ...subIds];
  const result = await Category.deleteMany({ _id: { $in: ids } });
  return { deleted: result.deletedCount ?? 0 };
}
