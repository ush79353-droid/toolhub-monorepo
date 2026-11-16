import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

const uri = fs
  .readFileSync(path.resolve(__dirname, '../../.env'), 'utf8')
  .match(/^MONGODB_URI=(.+)$/m)?.[1]
  ?.trim();
if (!uri) throw new Error('MONGODB_URI missing');

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const exact = await db.collection('tools').findOne({ slug: 'mortgage-rate-calculator' });
  console.log('exact', JSON.stringify(exact, null, 2));
  if (!exact) {
    const alt = await db
      .collection('tools')
      .find(
        { $or: [{ slug: /mortgage.?rate/i }, { name: /mortgage.?rate/i }] },
        {
          projection: {
            name: 1,
            slug: 1,
            componentKey: 1,
            isActive: 1,
            isDeveloped: 1,
            indexable: 1,
            executionType: 1,
          },
        }
      )
      .limit(10)
      .toArray();
    console.log('alt', JSON.stringify(alt, null, 2));
  }
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
