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
        { slug: /savings.?interest.?rate/i },
        { name: /savings.?interest.?rate/i },
        { nameKey: /savings.?interest.?rate/i },
        { slug: /savings/i, name: /interest.?rate/i },
      ],
    })
      .select(
        'name slug componentKey executionType isActive isDeveloped indexable embedEnabled shortDescription metaTitle metaDescription'
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
