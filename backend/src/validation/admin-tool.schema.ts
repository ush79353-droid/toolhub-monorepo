import { z } from 'zod';
import { isApprovedComponentKey } from '../modules/tools/tool.key';

const optionalText = (max: number) => z.string().trim().max(max).optional();

const httpUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === '' || /^https?:\/\/\S+$/i.test(value), 'Enter a full http(s) URL');

const optionalNullableNumber = z
  .union([z.number(), z.null()])
  .optional()
  .transform((value) => (value === undefined ? undefined : value));

export const toolFieldsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(160),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens'),
  categoryId: z.string().trim().min(1, 'Category is required'),
  pillarId: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => value || null),
  subPillarId: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => value || null),
  iconMediaId: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => value || null),
  executionType: z.enum(['client', 'server', 'third-party']).optional(),
  componentKey: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .optional()
    .transform((value) => value ?? '')
    .refine(
      (value) => value === '' || isApprovedComponentKey(value),
      'Choose an approved component key'
    ),
  shortDescription: optionalText(500),
  metaTitle: optionalText(70),
  metaDescription: optionalText(160),
  canonicalUrl: httpUrl.optional(),
  ogTitle: optionalText(70),
  ogDescription: optionalText(200),
  ogImageUrl: httpUrl.optional(),
  ogImageAlt: optionalText(200),
  ogType: optionalText(40),
  ogSiteName: optionalText(80),
  keywords: optionalText(200),
  indexable: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
  robotsNoArchive: z.boolean().optional(),
  robotsNoSnippet: z.boolean().optional(),
  robotsNoImageIndex: z.boolean().optional(),
  robotsMaxSnippet: optionalNullableNumber,
  robotsMaxImagePreview: z.enum(['', 'none', 'standard', 'large']).optional(),
  robotsMaxVideoPreview: optionalNullableNumber,
  twitterCard: z.enum(['', 'summary', 'summary_large_image']).optional(),
  twitterTitle: optionalText(70),
  twitterDescription: optionalText(200),
  twitterImageUrl: httpUrl.optional(),
  twitterImageAlt: optionalText(200),
  twitterSite: optionalText(40),
  schemaType: z.enum(['', 'WebPage', 'WebApplication']).optional(),
  includeFaqSchema: z.boolean().optional(),
  sitemapInclude: z.boolean().optional(),
  sitemapPriority: optionalNullableNumber,
  sitemapChangeFrequency: z
    .enum(['', 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
    .optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const listToolsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(120).optional(),
  categoryId: z.string().trim().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  sort: z.enum(['name', 'updatedAt']).default('updatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ToolFieldsInput = z.infer<typeof toolFieldsSchema>;
export type ListToolsQuery = z.infer<typeof listToolsQuerySchema>;
