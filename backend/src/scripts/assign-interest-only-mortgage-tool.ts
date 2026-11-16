/**
 * Activate Interest-Only Mortgage Calculator on its existing catalog row.
 * Run: npx tsx src/scripts/assign-interest-only-mortgage-tool.ts
 */
import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

const SLUG = 'interest-only-mortgage-calculator';
const COMPONENT_KEY = 'InterestOnlyMortgageCalculator';

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
  const result = await db.collection('tools').findOneAndUpdate(
    { slug: SLUG },
    {
      $set: {
        componentKey: COMPONENT_KEY,
        executionType: 'client',
        isDeveloped: true,
        isActive: true,
        indexable: true,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new Error(`No catalog row for slug=${SLUG}`);
  }

  console.log(
    JSON.stringify(
      {
        id: String(result._id),
        slug: result.slug,
        componentKey: result.componentKey,
        executionType: result.executionType,
        isDeveloped: result.isDeveloped,
        isActive: result.isActive,
        indexable: result.indexable,
        embedEnabled: result.embedEnabled,
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
