import { z } from 'zod';

export const categoryKindSchema = z.enum(['category', 'pillar', 'sub_pillar']);

const slugField = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .max(180)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens');

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(160),
  slug: slugField.optional(),
  kind: categoryKindSchema,
  parentId: z.string().trim().nullable().optional(),
  description: z.string().trim().max(2000).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(1).max(160).optional(),
    slug: slugField.optional(),
    description: z.string().trim().max(2000).optional(),
    sortOrder: z.coerce.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, { message: 'No fields to update' });

export const listCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(120).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
