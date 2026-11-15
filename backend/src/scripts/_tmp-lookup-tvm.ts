import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');
  try {
    const exact = await Tool.findOne({ slug: 'time-value-of-money-calculator' }).lean();
    const fuzzy = await Tool.find({
      $or: [
        { slug: /time.?value.?of.?money/i },
        { name: /time value of money/i },
        { slug: /tvm/i },
        { name: /\btvm\b/i },
      ],
    })
      .select('_id name slug componentKey isActive isDeveloped indexable embedEnabled')
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
            indexable: t.indexable,
            embedEnabled: t.embedEnabled,
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
