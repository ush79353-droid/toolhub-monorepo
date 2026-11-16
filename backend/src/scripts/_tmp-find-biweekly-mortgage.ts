import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const ok = await connectDB();
  if (!ok) throw new Error('MongoDB connection failed');
  try {
    const tools = await Tool.find({
      $or: [
        { slug: 'biweekly-mortgage-calculator' },
        { name: /bi-?weekly\s*mortgage/i },
        { slug: /bi-?weekly.*mortgage|mortgage.*bi-?weekly/i },
      ],
    })
      .select(
        'name slug componentKey executionType isActive isDeveloped indexable embedEnabled sitemapInclude'
      )
      .lean();
    console.log(JSON.stringify(tools, null, 2));
  } finally {
    await disconnectDB();
  }
}

void run().catch((err) => {
  console.error(err);
  process.exit(1);
});
