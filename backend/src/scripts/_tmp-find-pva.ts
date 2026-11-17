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
        { slug: /present.?value.?of.?annuity/i },
        { name: /present.?value.?of.?annuity/i },
        { slug: 'present-value-of-annuity-calculator' },
        { slug: /pv.?annuity/i },
      ],
    })
      .select(
        '_id name slug componentKey executionType isActive isDeveloped indexable embedEnabled shortDescription metaTitle'
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
