const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
};

const KEY_PATTERN =
  /^media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp|svg|gif|pdf)$/;

export const MEDIA_MAX_BYTES = 10 * 1024 * 1024;

export const MEDIA_TYPE_FILTER: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  pdf: 'application/pdf',
};

export function normalizeContentType(contentType: string): string {
  const value = contentType.trim().toLowerCase();
  return value === 'image/jpg' ? 'image/jpeg' : value;
}

export function extensionFor(contentType: string): string | null {
  return EXTENSION_BY_TYPE[normalizeContentType(contentType)] ?? null;
}

export function isOwnedMediaKey(key: string): boolean {
  return KEY_PATTERN.test(key);
}

const TYPE_BY_EXTENSION: Record<string, string> = Object.fromEntries(
  Object.entries(EXTENSION_BY_TYPE).map(([type, extension]) => [extension, type])
);

export function contentTypeForKey(key: string): string | null {
  const extension = key.slice(key.lastIndexOf('.') + 1);
  return TYPE_BY_EXTENSION[extension] ?? null;
}

const isDirect = process.argv[1]?.replace(/\\/g, '/').endsWith('media.key.ts');
if (isDirect) {
  if (extensionFor('image/png') !== 'png' || extensionFor('image/jpg') !== 'jpg') {
    throw new Error('extension map broken');
  }
  if (extensionFor('text/html') !== null) throw new Error('html must stay blocked');
  if (!isOwnedMediaKey('media/aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee.png')) {
    throw new Error('owned key rejected');
  }
  if (isOwnedMediaKey('../etc/passwd') || isOwnedMediaKey('media/../secret.png')) {
    throw new Error('foreign key accepted');
  }
  if (contentTypeForKey('media/aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee.jpg') !== 'image/jpeg') {
    throw new Error('key type map broken');
  }
  console.log('media.key ok');
}
