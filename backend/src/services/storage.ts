import path from 'path';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';
import { extensionFor, isOwnedMediaKey, MEDIA_MAX_BYTES, normalizeContentType } from '../modules/media/media.key';
import { deleteLocalMedia, headLocalMedia, isLocalMediaUrl, localPublicUrl, writeLocalMedia } from './local-storage';
import { deleteMediaObject, headMediaObject, mediaPublicUrl, signMediaUpload } from './s3.service';

export type StorageDriverName = 'local' | 's3';

function uploadRoot(): string {
  return path.resolve(process.cwd(), env.UPLOAD_DIR);
}

export function currentStorageDriver(): StorageDriverName {
  return env.STORAGE_DRIVER;
}

export function publicUrlFor(key: string): string {
  if (!isOwnedMediaKey(key)) throw new AppError('Invalid storage key.', 400, 'INVALID_KEY');
  return env.STORAGE_DRIVER === 's3' ? mediaPublicUrl(key) : localPublicUrl(key);
}

export async function uploadTarget(input: {
  key: string;
  contentType: string;
  size: number;
}): Promise<{ driver: StorageDriverName; uploadUrl: string }> {
  if (env.STORAGE_DRIVER === 's3') {
    return { driver: 's3', uploadUrl: await signMediaUpload(input) };
  }
  return {
    driver: 'local',
    uploadUrl: `/api/media-upload?key=${encodeURIComponent(input.key)}`,
  };
}

export async function headStored(key: string): Promise<{ contentType?: string; size?: number }> {
  return env.STORAGE_DRIVER === 's3' ? headMediaObject(key) : headLocalMedia(uploadRoot(), key);
}

export async function removeStored(url: string, key: string): Promise<void> {
  if (isLocalMediaUrl(url)) {
    await deleteLocalMedia(uploadRoot(), key);
    return;
  }
  await deleteMediaObject(key);
}

export async function saveUploadedObject(input: {
  key: string;
  contentType: string;
  body: Buffer;
}): Promise<{ key: string; size: number }> {
  if (env.STORAGE_DRIVER !== 'local') {
    throw new AppError('This server is storing files in S3. Use the signed upload URL.', 409, 'WRONG_DRIVER');
  }
  if (!isOwnedMediaKey(input.key)) throw new AppError('Invalid storage key.', 400, 'INVALID_KEY');
  const contentType = normalizeContentType(input.contentType);
  const extension = extensionFor(contentType);
  if (!extension || !input.key.endsWith(`.${extension}`)) {
    throw new AppError('This file type is not allowed.', 400, 'UNSUPPORTED_TYPE');
  }
  if (input.body.length === 0 || input.body.length > MEDIA_MAX_BYTES) {
    throw new AppError('File must be 10 MB or smaller.', 400, 'FILE_TOO_LARGE');
  }
  await writeLocalMedia(uploadRoot(), input.key, input.body);
  return { key: input.key, size: input.body.length };
}
