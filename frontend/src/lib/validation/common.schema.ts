import { z } from 'zod';
import { API_CONSTANTS } from '@/lib/constants';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(API_CONSTANTS.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(API_CONSTANTS.MAX_LIMIT)
    .default(API_CONSTANTS.DEFAULT_LIMIT),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

export const slugSchema = z
  .string()
  .trim()
  .min(2, 'Slug must be at least 2 characters')
  .max(100, 'Slug cannot exceed 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens');

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
