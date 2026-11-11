import fs from 'node:fs';
import path from 'node:path';
import { connectDB, disconnectDB } from '../config/database';
import { slugify } from '../utils/helpers';
import { Category, type CategoryKind } from '../modules/categories/category.model';
import type { Types } from 'mongoose';

interface SourceSubPillar {
  name: string;
  declared_tool_count?: number;
}

interface SourcePillar {
  pillar: string;
  declared_cluster_tool_count?: number;
  sub_pillars?: SourceSubPillar[];
}

interface SourceCategory {
  declared_tool_count?: number;
  pillars?: SourcePillar[];
}

interface SourceFile {
  categories: Record<string, SourceCategory>;
}

async function upsertNode(input: {
  seedKey: string;
  name: string;
  kind: CategoryKind;
  parent: Types.ObjectId | null;
  sortOrder: number;
  usedSlugs: Set<string>;
}) {
  const existing = await Category.findOne({ seedKey: input.seedKey });
  const base = slugify(input.name) || 'item';
  let slug = existing?.slug || base;
  if (!existing) {
    let n = 2;
    while (input.usedSlugs.has(slug) || (await Category.exists({ slug }))) {
      slug = `${base}-${n}`;
      n += 1;
    }
  }
  input.usedSlugs.add(slug);

  const doc = await Category.findOneAndUpdate(
    { seedKey: input.seedKey },
    {
      name: input.name,
      slug,
      seedKey: input.seedKey,
      kind: input.kind,
      parent: input.parent,
      sortOrder: input.sortOrder,
      description: '',
      isActive: true,
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
  if (!doc) throw new Error(`Failed to seed ${input.seedKey}`);
  return doc;
}

async function run() {
  const filePath = path.join(process.cwd(), 'data', 'tools-directory-hierarchy.json');
  const source = JSON.parse(fs.readFileSync(filePath, 'utf8')) as SourceFile;
  const connected = await connectDB();
  if (!connected) {
    console.error('Failed to connect to MongoDB.');
    process.exit(1);
  }

  const usedSlugs = new Set<string>();
  let categories = 0;
  let pillars = 0;
  let subPillars = 0;

  try {
    let categoryOrder = 0;
    for (const [name, category] of Object.entries(source.categories)) {
      const categoryDoc = await upsertNode({
        seedKey: `category:${slugify(name)}`,
        name,
        kind: 'category',
        parent: null,
        sortOrder: categoryOrder,
        usedSlugs,
      });
      categories += 1;
      categoryOrder += 1;

      let pillarOrder = 0;
      for (const pillar of category.pillars ?? []) {
        const pillarDoc = await upsertNode({
          seedKey: `pillar:${categoryDoc.slug}:${slugify(pillar.pillar)}`,
          name: pillar.pillar,
          kind: 'pillar',
          parent: categoryDoc._id,
          sortOrder: pillarOrder,
          usedSlugs,
        });
        pillars += 1;
        pillarOrder += 1;

        let subOrder = 0;
        for (const sub of pillar.sub_pillars ?? []) {
          await upsertNode({
            seedKey: `sub:${pillarDoc.slug}:${slugify(sub.name)}`,
            name: sub.name,
            kind: 'sub_pillar',
            parent: pillarDoc._id,
            sortOrder: subOrder,
            usedSlugs,
          });
          subPillars += 1;
          subOrder += 1;
        }
      }
    }

    console.log(
      `Seeded ${categories} categories, ${pillars} pillars, ${subPillars} sub-pillars.`
    );
  } finally {
    await disconnectDB();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
