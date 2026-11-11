import mongoose from 'mongoose';
import { AppError } from '../../middleware/error.middleware';
import { Category, type CategoryKind } from '../categories/category.model';
import { MediaAsset } from '../media/media.model';
import type { ListToolsQuery, ToolFieldsInput } from '../../validation/admin-tool.schema';
import { isToolSlug, toolNameKey } from './tool.key';
import { Tool, type ITool } from './tool.model';

export interface ToolRef {
  id: string;
  name: string;
  slug: string;
}

export interface ToolRecord {
  id: string;
  name: string;
  slug: string;
  category: ToolRef | null;
  pillar: ToolRef | null;
  subPillar: ToolRef | null;
  iconMediaId: string | null;
  iconUrl: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
  indexable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementNode {
  id: string;
  name: string;
  kind: CategoryKind;
  parentId: string | null;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function asRef(value: unknown): ToolRef | null {
  if (!value || typeof value !== 'object' || !('name' in value)) return null;
  const doc = value as { id?: string; _id?: { toString(): string }; name: string; slug: string };
  return { id: doc.id || String(doc._id), name: doc.name, slug: doc.slug };
}

function toRecord(doc: ITool): ToolRecord {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    category: asRef(doc.category),
    pillar: asRef(doc.pillar),
    subPillar: asRef(doc.subPillar),
    iconMediaId: doc.iconMedia ? String(doc.iconMedia) : null,
    iconUrl: doc.iconUrl,
    shortDescription: doc.shortDescription,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    canonicalUrl: doc.canonicalUrl,
    ogTitle: doc.ogTitle,
    ogDescription: doc.ogDescription,
    keywords: doc.keywords,
    indexable: doc.indexable,
    isActive: doc.isActive,
    isFeatured: doc.isFeatured,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function requirePlacement(id: string, kind: CategoryKind, parentId?: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(`Choose a valid ${kind.replace('_', ' ')}.`, 400, 'INVALID_PLACEMENT');
  }
  const doc = await Category.findById(id);
  if (!doc || doc.kind !== kind) {
    throw new AppError(`Choose a valid ${kind.replace('_', ' ')}.`, 400, 'INVALID_PLACEMENT');
  }
  if (parentId && String(doc.parent) !== parentId) {
    throw new AppError('That item does not belong under the selected parent.', 400, 'INVALID_PLACEMENT');
  }
  return doc;
}

async function resolveIcon(mediaId?: string | null) {
  if (!mediaId) return { iconMedia: null, iconUrl: '' };
  if (!mongoose.isValidObjectId(mediaId)) {
    throw new AppError('Choose an image from the media library.', 400, 'INVALID_ICON');
  }
  const media = await MediaAsset.findById(mediaId);
  if (!media || !media.contentType.startsWith('image/')) {
    throw new AppError('The icon must be an image from the media library.', 400, 'INVALID_ICON');
  }
  return { iconMedia: media._id, iconUrl: media.url };
}

async function assertUnique(name: string, slug: string, ignoreId?: string) {
  if (!isToolSlug(slug)) throw new AppError('Use lowercase letters, numbers, and hyphens.', 400, 'VALIDATION_ERROR');
  const clash = await Tool.findOne({
    $or: [{ nameKey: toolNameKey(name) }, { slug }],
    ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
  }).select('nameKey slug');
  if (!clash) return;
  if (clash.nameKey === toolNameKey(name)) throw new AppError('A tool with this name already exists.', 409, 'NAME_TAKEN');
  throw new AppError('This slug is already in use.', 409, 'SLUG_TAKEN');
}

function assign(doc: ITool, input: ToolFieldsInput, icon: { iconMedia: mongoose.Types.ObjectId | null; iconUrl: string }) {
  doc.name = input.name.trim();
  doc.nameKey = toolNameKey(input.name);
  doc.slug = input.slug;
  if (input.subPillarId && !input.pillarId) {
    throw new AppError('A sub-pillar needs a pillar.', 400, 'INVALID_PLACEMENT');
  }
  doc.category = new mongoose.Types.ObjectId(input.categoryId);
  doc.pillar = input.pillarId ? new mongoose.Types.ObjectId(input.pillarId) : null;
  doc.subPillar = input.subPillarId ? new mongoose.Types.ObjectId(input.subPillarId) : null;
  doc.iconMedia = icon.iconMedia;
  doc.iconUrl = icon.iconUrl;
  doc.shortDescription = input.shortDescription ?? '';
  doc.metaTitle = input.metaTitle ?? '';
  doc.metaDescription = input.metaDescription ?? '';
  doc.canonicalUrl = input.canonicalUrl ?? '';
  doc.ogTitle = input.ogTitle ?? '';
  doc.ogDescription = input.ogDescription ?? '';
  doc.keywords = input.keywords ?? '';
  if (input.indexable !== undefined) doc.indexable = input.indexable;
  if (input.isActive !== undefined) doc.isActive = input.isActive;
  if (input.isFeatured !== undefined) doc.isFeatured = input.isFeatured;
}

async function load(id: string) {
  const doc = await Tool.findById(id).populate('category pillar subPillar', 'name slug');
  if (!doc) throw new AppError('Tool not found.', 404, 'NOT_FOUND');
  return doc;
}

export async function listPlacement(): Promise<PlacementNode[]> {
  const docs = await Category.find().sort({ name: 1 }).select('name kind parent');
  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    kind: doc.kind,
    parentId: doc.parent ? String(doc.parent) : null,
  }));
}

export async function listTools(query: ListToolsQuery) {
  const filter: Record<string, unknown> = {};
  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ name: pattern }, { slug: pattern }];
  }
  if (query.categoryId && mongoose.isValidObjectId(query.categoryId)) filter.category = query.categoryId;
  if (query.status) filter.isActive = query.status === 'active';

  const direction = query.order === 'asc' ? 1 : -1;
  const sort: Record<string, 1 | -1> = query.sort === 'name' ? { name: direction } : { updatedAt: direction };
  const skip = (query.page - 1) * query.limit;
  const [docs, total] = await Promise.all([
    Tool.find(filter).sort(sort).skip(skip).limit(query.limit).populate('category pillar subPillar', 'name slug'),
    Tool.countDocuments(filter),
  ]);

  return {
    items: docs.map(toRecord),
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / query.limit)),
  };
}

export async function getTool(id: string): Promise<ToolRecord> {
  return toRecord(await load(id));
}

export async function createTool(input: ToolFieldsInput): Promise<ToolRecord> {
  await requirePlacement(input.categoryId, 'category');
  if (input.pillarId) await requirePlacement(input.pillarId, 'pillar', input.categoryId);
  if (input.subPillarId) await requirePlacement(input.subPillarId, 'sub_pillar', input.pillarId ?? undefined);
  await assertUnique(input.name, input.slug);
  const icon = await resolveIcon(input.iconMediaId);
  const doc = new Tool();
  assign(doc, input, icon);
  if (input.indexable === undefined) doc.indexable = true;
  if (input.isActive === undefined) doc.isActive = true;
  if (input.isFeatured === undefined) doc.isFeatured = false;
  await doc.save();
  return getTool(doc.id);
}

export async function updateTool(id: string, input: ToolFieldsInput): Promise<ToolRecord> {
  const doc = await Tool.findById(id);
  if (!doc) throw new AppError('Tool not found.', 404, 'NOT_FOUND');
  await requirePlacement(input.categoryId, 'category');
  if (input.pillarId) await requirePlacement(input.pillarId, 'pillar', input.categoryId);
  if (input.subPillarId) await requirePlacement(input.subPillarId, 'sub_pillar', input.pillarId ?? undefined);
  await assertUnique(input.name, input.slug, doc.id);
  assign(doc, input, await resolveIcon(input.iconMediaId));
  await doc.save();
  return getTool(doc.id);
}

export async function deleteTool(id: string): Promise<{ id: string }> {
  const doc = await Tool.findById(id);
  if (!doc) throw new AppError('Tool not found.', 404, 'NOT_FOUND');
  await doc.deleteOne();
  return { id: doc.id };
}
