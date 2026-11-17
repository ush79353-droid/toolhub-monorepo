import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

const uri = fs
  .readFileSync(path.resolve(__dirname, '../../.env'), 'utf8')
  .match(/^MONGODB_URI=(.+)$/m)?.[1]
  ?.trim();
if (!uri) throw new Error('MONGODB_URI missing');

async function main() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 45000,
    connectTimeoutMS: 45000,
  });
  await client.connect();
  const db = client.db();
  console.log('db', db.databaseName);
  const exact = await db
    .collection('tools')
    .findOne({ slug: 'debt-service-coverage-ratio-calculator' });
  console.log(
    'exact',
    JSON.stringify(
      exact
        ? {
            _id: String(exact._id),
            name: exact.name,
            slug: exact.slug,
            componentKey: exact.componentKey,
            executionType: exact.executionType,
            isActive: exact.isActive,
            isDeveloped: exact.isDeveloped,
            indexable: exact.indexable,
            embedEnabled: exact.embedEnabled,
            shortDescription: exact.shortDescription,
            metaTitle: exact.metaTitle,
            metaDescription: exact.metaDescription,
          }
        : null,
      null,
      2
    )
  );
  if (!exact) {
    const alt = await db
      .collection('tools')
      .find(
        {
          $or: [
            { slug: /debt.?service.?coverage/i },
            { name: /debt service coverage/i },
            { slug: /dscr/i },
            { name: /dscr/i },
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
