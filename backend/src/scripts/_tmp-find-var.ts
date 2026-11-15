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
        { slug: 'value-at-risk-calculator' },
        { slug: /value.?at.?risk/i },
        { name: /value at risk/i },
        { name: /\bVaR\b/i },
      ],
    })
      .select(
        '_id name slug isActive isDeveloped indexable embedEnabled componentKey executionType metaTitle metaDescription shortDescription'
      )
      .lean();
    console.log(JSON.stringify(tools, null, 2));
  } finally {
    await disconnectDB();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
