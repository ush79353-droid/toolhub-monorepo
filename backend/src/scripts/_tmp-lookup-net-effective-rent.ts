import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');
  try {
    const exact = await Tool.findOne({ slug: 'net-effective-rent-calculator' }).lean();
    const matches = await Tool.find({
      $or: [
        { slug: /net-effective-rent/i },
        { name: /net effective rent/i },
        { slug: /effective-rent/i },
        { name: /effective rent/i },
      ],
    })
      .select('_id name slug isActive isDeveloped indexable componentKey embedEnabled')
      .lean();

    console.log(
      JSON.stringify(
        {
          exact: exact
            ? {
                _id: String(exact._id),
                name: exact.name,
                slug: exact.slug,
                isActive: exact.isActive,
                isDeveloped: exact.isDeveloped,
                indexable: exact.indexable,
                componentKey: exact.componentKey ?? null,
                embedEnabled: exact.embedEnabled,
              }
            : null,
          matches: matches.map((t) => ({
            _id: String(t._id),
            name: t.name,
            slug: t.slug,
            isActive: t.isActive,
            isDeveloped: t.isDeveloped,
            componentKey: t.componentKey ?? null,
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
