import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const matches = await Tool.find({
      $or: [
        { slug: 'mortgage-calculator-with-taxes-and-insurance' },
        { slug: /mortgage.*tax/i },
        { slug: /tax.*insurance.*mortgage/i },
        { name: /mortgage.*tax/i },
        { name: /Taxes and Insurance/i },
        { name: /Mortgage Calculator with Taxes/i },
      ],
    })
      .select(
        'name slug componentKey isActive isDeveloped indexable embedEnabled executionType shortDescription'
      )
      .lean();

    const related = await Tool.find({
      $or: [{ slug: /mortgage/i }, { name: /mortgage/i }],
    })
      .select('name slug componentKey isActive isDeveloped indexable')
      .limit(30)
      .lean();

    console.log(JSON.stringify({ matches, related }, null, 2));
  } finally {
    await disconnectDB();
  }
}

void run().catch((err) => {
  console.error(err);
  process.exit(1);
});
