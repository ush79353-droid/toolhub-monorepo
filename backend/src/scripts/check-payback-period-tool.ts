import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');
  try {
    const exact = await Tool.findOne({ slug: 'payback-period-calculator' }).lean();
    const fuzzy = await Tool.find({
      $or: [
        { slug: /payback/i },
        { name: /payback/i },
        { nameKey: /payback/i },
      ],
    })
      .select({ _id: 1, name: 1, slug: 1, componentKey: 1, isActive: 1, isDeveloped: 1, indexable: 1, embedEnabled: 1 })
      .lean();

    console.log(
      JSON.stringify(
        {
          exact: exact
            ? {
                id: String(exact._id),
                name: exact.name,
                slug: exact.slug,
                componentKey: exact.componentKey,
                isActive: exact.isActive,
                isDeveloped: exact.isDeveloped,
                indexable: exact.indexable,
                embedEnabled: exact.embedEnabled,
              }
            : null,
          fuzzy: fuzzy.map((t) => ({
            id: String(t._id),
            name: t.name,
            slug: t.slug,
            componentKey: t.componentKey,
            isActive: t.isActive,
            isDeveloped: t.isDeveloped,
          })),
        },
        null,
        2
      )
    );
  } finally {
    await disconnectDB();
  }
}

void run().catch((err) => {
  console.error(err);
  process.exit(1);
});
