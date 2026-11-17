/**
 * Lookup deferred-annuity-calculator catalog row.
 * Run: npx tsx src/scripts/_tmp-find-deferred-annuity.ts
 */
import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

function readMongoUri(): string {
  const envPath = path.resolve(__dirname, '../../.env');
  const raw = fs.readFileSync(envPath, 'utf8');
  const match = raw.match(/^MONGODB_URI=(.+)$/m);
  if (!match) throw new Error('MONGODB_URI missing from backend/.env');
  return match[1]!.trim();
}

async function main() {
  const client = new MongoClient(readMongoUri());
  await client.connect();
  const db = client.db();
  const exact = await db.collection('tools').findOne({ slug: 'deferred-annuity-calculator' });
  const fuzzy = await db
    .collection('tools')
    .find({
      $or: [
        { slug: /deferred.?annuity/i },
        { name: /deferred.?annuity/i },
        { componentKey: /DeferredAnnuity/i },
      ],
    })
    .project({
      slug: 1,
      name: 1,
      componentKey: 1,
      isDeveloped: 1,
      isActive: 1,
      indexable: 1,
      embedEnabled: 1,
      executionType: 1,
    })
    .limit(10)
    .toArray();

  console.log(
    JSON.stringify(
      {
        exact: exact
          ? {
              id: String(exact._id),
              slug: exact.slug,
              name: exact.name,
              componentKey: exact.componentKey,
              executionType: exact.executionType,
              isDeveloped: exact.isDeveloped,
              isActive: exact.isActive,
              indexable: exact.indexable,
              embedEnabled: exact.embedEnabled,
            }
          : null,
        fuzzy: fuzzy.map((row) => ({
          id: String(row._id),
          slug: row.slug,
          name: row.name,
          componentKey: row.componentKey,
          isDeveloped: row.isDeveloped,
          isActive: row.isActive,
        })),
      },
      null,
      2
    )
  );
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
