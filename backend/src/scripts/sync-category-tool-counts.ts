import { connectDB, disconnectDB } from '../config/database';
import { Category, type CategoryKind } from '../modules/categories/category.model';
import { Tool } from '../modules/tools/tool.model';

async function activeCounts(field: 'category' | 'pillar' | 'subPillar'): Promise<Map<string, number>> {
  const rows = await Tool.aggregate<{ _id: unknown; count: number }>([
    { $match: { isActive: true, [field]: { $ne: null } } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  ]);
  return new Map(rows.map((row) => [String(row._id), row.count]));
}

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('Failed to connect to MongoDB.');

  try {
    const [categories, byCategory, byPillar, bySubPillar] = await Promise.all([
      Category.find().select('name slug kind declaredToolCount').sort({ kind: 1, name: 1 }),
      activeCounts('category'),
      activeCounts('pillar'),
      activeCounts('subPillar'),
    ]);
    const counts: Record<CategoryKind, Map<string, number>> = {
      category: byCategory,
      pillar: byPillar,
      sub_pillar: bySubPillar,
    };

    let changed = 0;
    const ops = categories.map((category) => {
      const next = counts[category.kind].get(category.id) ?? 0;
      if (category.declaredToolCount !== next) changed += 1;
      if (category.kind === 'category') {
        console.log(`${category.name}: ${next} active tools`);
      }
      return {
        updateOne: {
          filter: { _id: category._id },
          update: { $set: { declaredToolCount: next } },
        },
      };
    });

    if (ops.length > 0) {
      await Category.bulkWrite(ops, { timestamps: false });
    }
    console.log(`Synced ${categories.length} categories. ${changed} counts changed.`);
  } finally {
    await disconnectDB();
  }
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
