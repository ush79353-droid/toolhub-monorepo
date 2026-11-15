import { z } from 'zod';

const relativePath = z
  .string()
  .max(300)
  .refine((value) => value === '' || (value.startsWith('src/') && !value.includes('..') && !value.includes('\\')), {
    message: 'Component paths must stay inside src/.',
  });

export const auditRowSchema = z.object({
  id: z.string().trim().min(1).max(32),
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(180),
  category: z.string().trim().max(200),
  component: z.string().trim().max(120),
  componentPath: relativePath,
  route: z.string().trim().max(220),
  isDeveloped: z.boolean(),
  status: z.enum(['developed', 'not_developed', 'needs_review']),
  issue: z.string().max(400),
  issueCode: z.enum(['', 'missing_component', 'broken_route', 'broken_import', 'placeholder', 'ambiguous', 'unwired']),
});

const statSchema = z.object({
  category: z.string().trim().max(200),
  total: z.number().int().nonnegative(),
  developed: z.number().int().nonnegative(),
  pending: z.number().int().nonnegative(),
  needsReview: z.number().int().nonnegative(),
});

const duplicateSchema = z.object({
  value: z.string().max(220),
  count: z.number().int().positive(),
  slugs: z.array(z.string().max(180)).max(50),
});

const sharedSchema = z.object({
  component: z.string().max(120),
  count: z.number().int().positive(),
  slugs: z.array(z.string().max(180)).max(50),
});

export const saveToolAuditSchema = z.object({
  source: z.enum(['filesystem', 'manifest']),
  warning: z.string().max(500).default(''),
  totals: z.object({
    total: z.number().int().nonnegative(),
    developed: z.number().int().nonnegative(),
    notDeveloped: z.number().int().nonnegative(),
    needsReview: z.number().int().nonnegative(),
    completionPercent: z.number().nonnegative().max(100),
  }),
  categories: z.array(statSchema).max(500),
  duplicates: z.object({
    ids: z.array(duplicateSchema).max(100),
    slugs: z.array(duplicateSchema).max(100),
    routes: z.array(duplicateSchema).max(100),
    sharedComponents: z.array(sharedSchema).max(100),
  }),
  rows: z.array(auditRowSchema).max(20000),
  updates: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(32),
        slug: z.string().trim().min(1).max(180),
        isDeveloped: z.boolean(),
      })
    )
    .max(20000),
  initializeIds: z.array(z.string().trim().min(1).max(32)).max(20000),
});

export type SaveToolAuditInput = z.infer<typeof saveToolAuditSchema>;
