import { z } from 'zod';
import { TOOL_CATEGORIES, TOOL_EXECUTION_TYPES } from '@mega-tools/shared';
import { slugSchema } from './common.schema';

export const toolCategorySchema = z.enum(
  TOOL_CATEGORIES as unknown as [string, ...string[]]
);

export const toolExecutionTypeSchema = z.enum(
  TOOL_EXECUTION_TYPES as unknown as [string, ...string[]]
);

export const toolMetadataSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  category: toolCategorySchema,
  executionType: toolExecutionTypeSchema,
  componentKey: z.string().min(2).max(100),
  version: z.string().default('1.0.0'),
  isPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
  icon: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export type ToolMetadataInput = z.infer<typeof toolMetadataSchema>;

