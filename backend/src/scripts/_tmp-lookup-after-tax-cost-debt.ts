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
        { slug: 'after-tax-cost-of-debt-calculator' },
        { name: /after-tax cost of debt/i },
        { slug: /after-tax-cost-of-debt/i },
      ],
    })
      .select(
        '_id name slug componentKey isActive isDeveloped indexable embedEnabled executionType shortDescription metaTitle metaDescription'
      )
      .lean();

    const neighbors = await Tool.find({
      $or: [
        { slug: /cost-of-debt/i },
        { name: /cost of debt/i },
        { slug: /after-tax/i },
      ],
    })
      .select('_id name slug componentKey isActive isDeveloped indexable')
      .limit(20)
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
