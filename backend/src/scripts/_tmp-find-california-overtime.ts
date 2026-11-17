import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');
  try {
    const tools = await Tool.find({
      $or: [
        { slug: 'california-overtime-calculator' },
        { name: /california overtime/i },
        { slug: /overtime/i },
      ],
    })
      .select(
        'name slug componentKey isActive isDeveloped indexable embedEnabled executionType shortDescription'
      )
      .lean();

    console.log(
      JSON.stringify(
        tools.map((t) => ({
          id: String(t._id),
          name: t.name,
          slug: t.slug,
          componentKey: t.componentKey,
          isActive: t.isActive,
          isDeveloped: t.isDeveloped,
          indexable: t.indexable,
          embedEnabled: t.embedEnabled,
          executionType: t.executionType,
          shortDescription: t.shortDescription,
        })),
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
