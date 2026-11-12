import { mkdir, rm, stat, writeFile } from 'fs/promises';
import path from 'path';
import { AppError } from '../middleware/error.middleware';
import { contentTypeForKey, isOwnedMediaKey } from '../modules/media/media.key';

export function resolveMediaFile(root: string, key: string): string {
  if (!isOwnedMediaKey(key)) {
    throw new AppError('Invalid storage key.', 400, 'INVALID_KEY');
  }
  const base = path.resolve(root);
  const full = path.resolve(base, key);
  const relative = path.relative(base, full);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new AppError('Invalid storage key.', 400, 'INVALID_KEY');
  }
  return full;
}

export function localPublicUrl(key: string): string {
  return `/uploads/${key}`;
}

export function isLocalMediaUrl(url: string): boolean {
  return url.startsWith('/uploads/');
}

export async function writeLocalMedia(root: string, key: string, body: Buffer): Promise<void> {
  const full = resolveMediaFile(root, key);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, body);
}

export async function headLocalMedia(root: string, key: string): Promise<{ contentType?: string; size?: number }> {
  const full = resolveMediaFile(root, key);
  try {
    const info = await stat(full);
    if (!info.isFile()) throw new AppError('The file did not reach storage. Try the upload again.', 400, 'UPLOAD_MISSING');
    return { contentType: contentTypeForKey(key) ?? undefined, size: info.size };
  } catch (error) {
    if (error instanceof AppError) throw error;
    const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    if (code === 'ENOENT') {
      throw new AppError('The file did not reach storage. Try the upload again.', 400, 'UPLOAD_MISSING');
    }
    throw new AppError('Storage request failed.', 502, 'STORAGE_ERROR');
  }
}

export async function deleteLocalMedia(root: string, key: string): Promise<void> {
  const full = resolveMediaFile(root, key);
  await rm(full, { force: true });
}

const isDirect = process.argv[1]?.replace(/\\/g, '/').endsWith('local-storage.ts');
if (isDirect) {
  void (async () => {
  const os = await import('os');
  const root = path.join(os.tmpdir(), 'omega-storage-check');
  const key = 'media/aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee.png';
  const full = resolveMediaFile(root, key);
  if (!full.endsWith(`${path.sep}media${path.sep}aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee.png`)) {
    throw new Error('resolved path left the media folder');
  }
  let escaped = false;
  try {
    resolveMediaFile(root, '../secret.png');
  } catch {
    escaped = true;
  }
  if (!escaped) throw new Error('traversal key was accepted');
  await writeLocalMedia(root, key, Buffer.from('png'));
  const head = await headLocalMedia(root, key);
  if (head.size !== 3 || head.contentType !== 'image/png') throw new Error('local head mismatch');
  await deleteLocalMedia(root, key);
  await rm(root, { recursive: true, force: true });
  console.log('local-storage ok');
  })().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
