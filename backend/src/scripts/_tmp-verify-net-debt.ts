import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');
  try {
    const t = await Tool.findOne({ slug: 'net-debt-calculator' }).lean();
    if (!t) throw new Error('missing');
    console.log(
      JSON.stringify(
        {
          id: String(t._id),
          slug: t.slug,
          componentKey: t.componentKey,
          isActive: t.isActive,
          isDeveloped: t.isDeveloped,
          indexable: t.indexable,
          embedEnabled: t.embedEnabled,
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
