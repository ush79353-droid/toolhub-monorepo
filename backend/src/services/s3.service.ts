import {
  DeleteObjectCommand,
  GetBucketCorsCommand,
  HeadObjectCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
  type CORSRule,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

let client: S3Client | null = null;
let corsReady = false;

function requireConfig(): void {
  if (
    !env.AWS_ACCESS_KEY ||
    !env.AWS_SECRET_KEY ||
    !env.BUCKET_REGION ||
    !env.AWS_BUCKET_NAME ||
    !env.AWS_BASE_URL
  ) {
    throw new AppError('File storage is not configured.', 503, 'S3_NOT_CONFIGURED');
  }
}

function s3(): S3Client {
  requireConfig();
  if (!client) {
    client = new S3Client({
      region: env.BUCKET_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_KEY,
      },
      // Browser PUT does not send the SDK's default checksum headers.
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }
  return client;
}

export function mediaPublicUrl(key: string): string {
  requireConfig();
  const base = env.AWS_BASE_URL.replace(/\/$/, '');
  return `${base}/${key.split('/').map(encodeURIComponent).join('/')}`;
}

async function ensureUploadCors(): Promise<void> {
  if (corsReady) return;
  const origins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
  let rules: CORSRule[] = [];
  try {
    const current = await s3().send(new GetBucketCorsCommand({ Bucket: env.AWS_BUCKET_NAME }));
    rules = current.CORSRules ?? [];
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    if (name !== 'NoSuchCORSConfiguration') {
      logger.warn('Could not read S3 CORS. Direct upload needs PUT allowed from the admin origin.');
      corsReady = true;
      return;
    }
  }

  const covered = origins.every((origin) =>
    rules.some(
      (rule) =>
        (rule.AllowedOrigins ?? []).some((allowed) => allowed === '*' || allowed === origin) &&
        (rule.AllowedMethods ?? []).includes('PUT')
    )
  );
  if (covered && rules.length > 0) {
    corsReady = true;
    return;
  }

  rules.push({
    AllowedOrigins: origins,
    AllowedMethods: ['GET', 'PUT', 'HEAD'],
    AllowedHeaders: ['*'],
    ExposeHeaders: ['ETag'],
    MaxAgeSeconds: 3000,
  });

  try {
    await s3().send(
      new PutBucketCorsCommand({
        Bucket: env.AWS_BUCKET_NAME,
        CORSConfiguration: { CORSRules: rules },
      })
    );
    corsReady = true;
  } catch (error) {
    logger.warn('Could not update S3 CORS. Direct browser upload will fail until PUT is allowed.', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    corsReady = true;
  }
}

export async function signMediaUpload(input: {
  key: string;
  contentType: string;
  size: number;
}): Promise<string> {
  await ensureUploadCors();
  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: input.key,
    ContentType: input.contentType,
    ContentLength: input.size,
  });
  return getSignedUrl(s3(), command, { expiresIn: 300 });
}

export async function headMediaObject(key: string): Promise<{ contentType?: string; size?: number }> {
  try {
    const head = await s3().send(new HeadObjectCommand({ Bucket: env.AWS_BUCKET_NAME, Key: key }));
    return { contentType: head.ContentType, size: head.ContentLength };
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    if (name === 'NotFound' || name === 'NoSuchKey') {
      throw new AppError('The file did not reach storage. Try the upload again.', 400, 'UPLOAD_MISSING');
    }
    logger.error('S3 head failed', undefined, {
      name,
      message: error instanceof Error ? error.message : 'unknown',
    });
    throw new AppError('Storage request failed.', 502, 'STORAGE_ERROR');
  }
}

export async function deleteMediaObject(key: string): Promise<void> {
  try {
    await s3().send(new DeleteObjectCommand({ Bucket: env.AWS_BUCKET_NAME, Key: key }));
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    if (name === 'NotFound' || name === 'NoSuchKey') return;
    logger.error('S3 delete failed', undefined, {
      name,
      message: error instanceof Error ? error.message : 'unknown',
    });
    throw new AppError('Storage request failed.', 502, 'STORAGE_ERROR');
  }
}
