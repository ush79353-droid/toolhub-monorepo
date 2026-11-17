import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const exact = await Tool.findOne({ slug: 'future-value-of-annuity-calculator' }).lean();
    const fuzzy = await Tool.find({
      $or: [
        { slug: /future.?value.?of.?annuity/i },
        { name: /future value of annuity/i },
        { slug: /annuity/i },
        { name: /annuity/i },
      ],
    })
      .select(
        '_id name slug componentKey executionType isActive isDeveloped indexable embedEnabled shortDescription'
      )
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
                executionType: exact.executionType,
                isActive: exact.isActive,
                isDeveloped: exact.isDeveloped,
                indexable: exact.indexable,
                embedEnabled: exact.embedEnabled,
                shortDescription: exact.shortDescription,
              }
            : null,
          fuzzy: fuzzy.map((t) => ({
            id: String(t._id),
            name: t.name,
            slug: t.slug,
            componentKey: t.componentKey,
            isActive: t.isActive,
            isDeveloped: t.isDeveloped,
            indexable: t.indexable,
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
