import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const exact = await Tool.findOne({ slug: 'net-debt-calculator' })
      .select(
        'name slug componentKey isActive isDeveloped indexable embedEnabled executionType shortDescription metaTitle metaDescription'
      )
      .lean();

    const matches = await Tool.find({
      $or: [{ slug: /net.?debt/i }, { name: /net.?debt/i }],
    })
      .select('name slug componentKey isActive isDeveloped indexable')
      .lean();

    console.log(JSON.stringify({ exact, matches }, null, 2));
  } finally {
    await disconnectDB();
  }
}

void run().catch((err) => {
  console.error(err);
  process.exit(1);
});
