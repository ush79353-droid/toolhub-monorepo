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
      slug: { $regex: /texas.*overtime|overtime.*texas/i },
    })
      .select('slug name isActive isDeveloped indexable componentKey metaTitle shortDescription')
      .lean();
    const exact = await Tool.findOne({ slug: 'texas-overtime-calculator' })
      .select(
        'slug name isActive isDeveloped indexable componentKey metaTitle shortDescription embedEnabled'
      )
      .lean();
    console.log(
      JSON.stringify(
        {
          exact: exact
            ? { ...exact, _id: String(exact._id) }
            : null,
          matches: tools.map((t) => ({ ...t, _id: String(t._id) })),
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
