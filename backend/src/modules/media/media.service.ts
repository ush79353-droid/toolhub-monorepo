import { randomUUID } from 'crypto';
import { AppError } from '../../middleware/error.middleware';
import { deleteMediaObject, headMediaObject, mediaPublicUrl, signMediaUpload } from '../../services/s3.service';
import type { ConfirmMediaInput, ListMediaQuery, SignMediaInput } from '../../validation/media.schema';
import { extensionFor, isOwnedMediaKey, MEDIA_MAX_BYTES, MEDIA_TYPE_FILTER, normalizeContentType } from './media.key';
import { MediaAsset, type IMediaAsset } from './media.model';

export interface MediaItem {
  id: string;
  fileName: string;
  fileType: string;
  size: number;
  width: number | null;
  height: number | null;
  altText: string;
  url: string;
  createdAt: string;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toItem(doc: IMediaAsset): MediaItem {
  return {
    id: doc.id,
    fileName: doc.fileName,
    fileType: doc.contentType,
    size: doc.size,
    width: doc.width ?? null,
    height: doc.height ?? null,
    altText: doc.altText,
    url: doc.url,
    createdAt: doc.createdAt.toISOString(),
  };
}

function displayName(fileName: string): string {
  const base = fileName.split(/[/\\]/).pop()?.trim() || 'file';
  return base.slice(0, 180);
}

export async function listMedia(query: ListMediaQuery) {
  const filter: Record<string, unknown> = {};
  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ fileName: pattern }, { altText: pattern }];
  }
  if (query.type) {
    const contentType = MEDIA_TYPE_FILTER[query.type.toLowerCase()];
    if (contentType) filter.contentType = contentType;
  }

  const skip = (query.page - 1) * query.limit;
  const [docs, total] = await Promise.all([
    MediaAsset.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    MediaAsset.countDocuments(filter),
  ]);

  return {
    items: docs.map(toItem),
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / query.limit)),
  };
}

export async function createMediaUpload(input: SignMediaInput) {
  const contentType = normalizeContentType(input.contentType);
  const extension = extensionFor(contentType);
  if (!extension) throw new AppError('This file type is not allowed.', 400, 'UNSUPPORTED_TYPE');
  if (input.size > MEDIA_MAX_BYTES) {
    throw new AppError('File must be 10 MB or smaller.', 400, 'FILE_TOO_LARGE');
  }

  const key = `media/${randomUUID()}.${extension}`;
  const uploadUrl = await signMediaUpload({ key, contentType, size: input.size });
  return {
    uploadUrl,
    key,
    contentType,
    publicUrl: mediaPublicUrl(key),
  };
}

export async function confirmMediaUpload(input: ConfirmMediaInput): Promise<MediaItem> {
  if (!isOwnedMediaKey(input.key)) throw new AppError('Invalid storage key.', 400, 'INVALID_KEY');
  const contentType = normalizeContentType(input.contentType);
  if (!extensionFor(contentType)) throw new AppError('This file type is not allowed.', 400, 'UNSUPPORTED_TYPE');

  const stored = await headMediaObject(input.key);
  if (!stored.size || stored.size > MEDIA_MAX_BYTES) {
    throw new AppError('Uploaded file is empty or larger than 10 MB.', 400, 'FILE_TOO_LARGE');
  }
  if (stored.contentType && normalizeContentType(stored.contentType) !== contentType) {
    throw new AppError('Uploaded file type does not match.', 400, 'TYPE_MISMATCH');
  }

  const fileName = displayName(input.fileName);
  try {
    const doc = await MediaAsset.create({
      fileName,
      contentType,
      size: stored.size,
      width: input.width,
      height: input.height,
      altText: input.altText?.trim() || fileName.replace(/\.[^.]+$/, ''),
      key: input.key,
      url: mediaPublicUrl(input.key),
    });
    return toItem(doc);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      throw new AppError('This file is already in the library.', 409, 'ALREADY_SAVED');
    }
    throw error;
  }
}

export async function deleteMedia(id: string): Promise<{ id: string }> {
  const doc = await MediaAsset.findById(id);
  if (!doc) throw new AppError('Media asset not found.', 404, 'NOT_FOUND');
  await deleteMediaObject(doc.key);
  await doc.deleteOne();
  return { id: doc.id };
}
