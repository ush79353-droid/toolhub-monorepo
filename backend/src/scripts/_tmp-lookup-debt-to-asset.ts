import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const tool = await Tool.findOne({
      $or: [
        { slug: 'debt-to-asset-ratio-calculator' },
        { slug: /debt-to-asset/i },
        { name: /debt to asset/i },
      ],
    })
      .select(
        '_id name slug componentKey isActive isDeveloped indexable embedEnabled executionType shortDescription metaTitle metaDescription updatedAt'
      )
      .lean();

    const neighbors = await Tool.find({
      $or: [{ slug: /debt.*asset/i }, { name: /debt.*asset/i }],
    })
      .select('_id name slug componentKey isActive isDeveloped indexable')
      .limit(15)
      .lean();

    console.log(JSON.stringify({ tool, neighbors }, null, 2));
  } finally {
    await disconnectDB();
  }
}

void run().catch((err) => {
  console.error(err);
  process.exit(1);
});
