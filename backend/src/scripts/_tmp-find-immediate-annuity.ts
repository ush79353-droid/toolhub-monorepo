import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 60_000 });
  const tools = await mongoose.connection.db!.collection('tools').find(
    {
      $or: [
        { slug: 'immediate-annuity-calculator' },
        { slug: /immediate.?annuity/i },
        { name: /Immediate Annuity/i },
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
        category: 1,
        pillar: 1,
        subPillar: 1,
        shortDescription: 1,
        metaTitle: 1,
        metaDescription: 1,
      },
    }
  ).toArray();
  console.log(JSON.stringify(tools, null, 2));
  await mongoose.disconnect();
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
