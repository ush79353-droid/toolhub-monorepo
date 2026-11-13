import fs from 'node:fs';
import path from 'node:path';
import { connectDB, disconnectDB } from '../config/database';
import { env } from '../config/env';
import { slugify } from '../utils/helpers';
import { Category, type ICategory } from '../modules/categories/category.model';
import { buildToolCopy } from '../modules/tools/tool.copy';
import { toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

interface CatalogTool {
  name: string;
  category: string;
  pillar: string | null;
  subPillar: string | null;
}

function norm(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function placeKey(kind: string, parentId: string | null, name: string): string {
  return `${kind}|${parentId ?? ''}|${norm(name)}`;
}

async function ensureSubPillar(name: string, pillar: ICategory, nodes: Map<string, ICategory>) {
  const existing = nodes.get(placeKey('sub_pillar', pillar.id, name));
  if (existing) return existing;

  const base = slugify(name) || 'sub-pillar';
  let slug = base;
  let suffix = 2;
  while (await Category.exists({ slug })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  const sortOrder = await Category.countDocuments({ parent: pillar._id });
  const created = await Category.create({
    name,
    slug,
    seedKey: `sub:${pillar.slug}:${base}`,
    kind: 'sub_pillar',
    parent: pillar._id,
    sortOrder,
    description: '',
    isActive: true,
  });
  nodes.set(placeKey('sub_pillar', created.id, name), created);
  nodes.set(placeKey('sub_pillar', pillar.id, name), created);
  return created;
}

async function run() {
  const filePath = path.join(process.cwd(), 'data', 'tools-catalog.json');
  const catalog = JSON.parse(fs.readFileSync(filePath, 'utf8')) as CatalogTool[];
  const origin = env.CORS_ORIGIN.split(',')[0]?.trim() || 'http://localhost:3000';
  const connected = await connectDB();
  if (!connected) {
    console.error('Failed to connect to MongoDB.');
    process.exit(1);
  }

  try {
    const nodes = new Map<string, ICategory>();
    for (const doc of await Category.find()) {
      nodes.set(placeKey(doc.kind, doc.parent ? String(doc.parent) : null, doc.name), doc);
    }

    const usedSlugs = new Set<string>();
    const slugByName = new Map<string, string>();
    for (const tool of await Tool.find().select('nameKey slug')) {
      usedSlugs.add(tool.slug);
      slugByName.set(tool.nameKey, tool.slug);
    }

    const ops = [];
    let categoryOnly = 0;
    let withSub = 0;
    let createdSubs = 0;
    const missing: string[] = [];

    for (const item of catalog) {
      const category = nodes.get(placeKey('category', null, item.category));
      if (!category) {
        missing.push(`category missing: ${item.category} (${item.name})`);
        continue;
      }

      let pillar: ICategory | null = null;
      if (item.pillar) {
        pillar = nodes.get(placeKey('pillar', category.id, item.pillar)) ?? null;
        if (!pillar) {
          missing.push(`pillar missing: ${item.category} > ${item.pillar} (${item.name})`);
          continue;
        }
      }

      let sub: ICategory | null = null;
      if (item.subPillar) {
        if (!pillar) {
          missing.push(`sub-pillar without pillar: ${item.name}`);
          continue;
        }
        const before = nodes.get(placeKey('sub_pillar', pillar.id, item.subPillar));
        sub = await ensureSubPillar(item.subPillar, pillar, nodes);
        if (!before) createdSubs += 1;
      }

      const nameKey = toolNameKey(item.name);
      let slug = slugByName.get(nameKey) || slugify(item.name) || 'tool';
      if (!slugByName.has(nameKey)) {
        const base = slug;
        let suffix = 2;
        while (usedSlugs.has(slug)) {
          slug = `${base}-${suffix}`;
          suffix += 1;
        }
        usedSlugs.add(slug);
        slugByName.set(nameKey, slug);
      }

      const copy = buildToolCopy(
        { name: item.name, slug, category: category.name, pillar: pillar?.name ?? null, subPillar: sub?.name ?? null },
        origin
      );
      if (!pillar) categoryOnly += 1;
      if (sub) withSub += 1;

      ops.push({
        updateOne: {
          filter: { nameKey },
          update: {
            $set: {
              name: item.name.trim(),
              nameKey,
              slug,
              category: category._id,
              pillar: pillar?._id ?? null,
              subPillar: sub?._id ?? null,
              iconMedia: null,
              iconUrl: '',
              ...copy,
              indexable: false,
              isActive: false,
              isFeatured: false,
            },
            $setOnInsert: { isDeveloped: true },
          },
          upsert: true,
        },
      });
    }

    if (missing.length) {
      console.error(missing.slice(0, 20).join('\n'));
      throw new Error(`${missing.length} tools could not be placed.`);
    }

    for (let index = 0; index < ops.length; index += 400) {
      await Tool.bulkWrite(ops.slice(index, index + 400), { ordered: false });
    }

    console.log(
      `Seeded ${ops.length} tools (${categoryOnly} category-only, ${withSub} with a sub-pillar, ${createdSubs} sub-pillars created).`
    );
  } finally {
    await disconnectDB();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
