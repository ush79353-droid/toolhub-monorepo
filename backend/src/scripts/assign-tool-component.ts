import { connectDB, disconnectDB } from '../config/database';
import '../modules/categories/category.model';
import { isApprovedComponentKey, isToolSlug } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';
import type { ToolExecutionType } from '../types/tool';

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

async function run(): Promise<void> {
  const slug = (argValue('--slug') ?? '').trim().toLowerCase();
  const componentKey = (argValue('--component') ?? '').trim();
  const executionType = (argValue('--execution') ?? 'client').trim() as ToolExecutionType;
  const activate = hasFlag('--activate');

  if (!slug || !isToolSlug(slug)) {
    throw new Error('Provide a valid --slug (e.g. --slug auto-loan-calculator)');
  }
  if (!componentKey || !isApprovedComponentKey(componentKey)) {
    throw new Error(`Invalid or unapproved --component key "${componentKey}"`);
  }
  if (!['client', 'server', 'third-party'].includes(executionType)) {
    throw new Error(`Invalid --execution "${executionType}"`);
  }

  const connected = await connectDB();
  if (!connected) {
    throw new Error('Failed to connect to MongoDB.');
  }

  try {
    const existing = await Tool.findOne({ slug }).populate('category pillar subPillar', 'name slug');
    if (!existing) {
      throw new Error(`Tool record with slug "${slug}" not found in MongoDB.`);
    }

    existing.componentKey = componentKey;
    existing.executionType = executionType;
    if (activate) {
      existing.isActive = true;
    }
    await existing.save();

    console.log(
      JSON.stringify(
        {
          id: existing.id,
          name: existing.name,
          slug: existing.slug,
          componentKey: existing.componentKey,
          executionType: existing.executionType,
          isActive: existing.isActive,
          isFeatured: existing.isFeatured,
          indexable: existing.indexable,
          metaTitle: existing.metaTitle,
          metaDescription: existing.metaDescription,
        },
        null,
        2
      )
    );
  } finally {
    await disconnectDB();
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
