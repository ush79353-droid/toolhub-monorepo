import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function main(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');
  try {
    const tools = await Tool.find({
      $or: [
        { slug: 'gross-margin-calculator' },
        { name: /gross margin/i },
        { slug: /gross-margin/i },
      ],
    })
      .select({
        _id: 1,
        name: 1,
        slug: 1,
        componentKey: 1,
        isActive: 1,
        isDeveloped: 1,
        indexable: 1,
        embedEnabled: 1,
      })
      .lean();
    console.log(JSON.stringify(tools, null, 2));
  } finally {
    await disconnectDB();
  }
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
