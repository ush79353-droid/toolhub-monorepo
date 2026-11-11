import { z } from 'zod';

export const listMediaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(24),
  search: z.string().trim().max(120).optional(),
  type: z.string().trim().max(20).optional(),
});

export const signMediaSchema = z.object({
  fileName: z.string().trim().min(1).max(180),
  contentType: z.string().trim().min(1).max(120),
  size: z.number().int().positive(),
});

export const confirmMediaSchema = z.object({
  key: z.string().trim().min(1).max(220),
  fileName: z.string().trim().min(1).max(180),
  contentType: z.string().trim().min(1).max(120),
  width: z.number().int().positive().max(20000).optional(),
  height: z.number().int().positive().max(20000).optional(),
  altText: z.string().trim().max(300).optional(),
});

export type ListMediaQuery = z.infer<typeof listMediaQuerySchema>;
export type SignMediaInput = z.infer<typeof signMediaSchema>;
export type ConfirmMediaInput = z.infer<typeof confirmMediaSchema>;
