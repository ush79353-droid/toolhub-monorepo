import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');
  await mongoose.connect(uri);
  const t = await mongoose.connection.db!.collection('tools').findOne(
    {
      $or: [
        { slug: 'week-over-week-calculator' },
        { name: /Week Over Week/i },
        { name: /WoW/i },
      ],
    },
    {
      projection: {
        name: 1,
        slug: 1,
        componentKey: 1,
        isActive: 1,
        isDeveloped: 1,
        indexable: 1,
        embedEnabled: 1,
        executionType: 1,
        isFeatured: 1,
        shortDescription: 1,
        metaTitle: 1,
        metaDescription: 1,
      },
    }
  );
  console.log(JSON.stringify(t, null, 2));
  await mongoose.disconnect();
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
