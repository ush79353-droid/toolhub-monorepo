import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

function readMongoUri(): string {
  const envPath = path.resolve(__dirname, '../../.env');
  const raw = fs.readFileSync(envPath, 'utf8');
  const match = raw.match(/^MONGODB_URI=(.+)$/m);
  const uri = match?.[1]?.trim();
  if (!uri) throw new Error('MONGODB_URI missing in backend/.env');
  return uri;
}

async function run(): Promise<void> {
  const client = new MongoClient(readMongoUri(), {
    serverSelectionTimeoutMS: 45000,
    connectTimeoutMS: 45000,
  });
  await client.connect();
  try {
    const db = client.db();
    const tools = db.collection('tools');
    const exact = await tools.findOne({ slug: 'debt-to-equity-calculator' });
    const fuzzy = await tools
      .find({
        $or: [{ slug: /debt.?to.?equity/i }, { name: /debt.?to.?equity/i }],
      })
      .project({
        name: 1,
        slug: 1,
        isActive: 1,
        isDeveloped: 1,
        indexable: 1,
        componentKey: 1,
      })
      .toArray();

    console.log(
      'EXACT',
      JSON.stringify(
        exact
          ? {
              id: String(exact._id),
              name: exact.name,
              slug: exact.slug,
              isActive: exact.isActive,
              isDeveloped: exact.isDeveloped,
              indexable: exact.indexable,
              componentKey: exact.componentKey,
              shortDescription: exact.shortDescription,
              metaTitle: exact.metaTitle,
              metaDescription: exact.metaDescription,
            }
          : null,
        null,
        2
      )
    );
    console.log(
      'FUZZY',
      JSON.stringify(
        fuzzy.map((t) => ({
          id: String(t._id),
          name: t.name,
          slug: t.slug,
          isActive: t.isActive,
          isDeveloped: t.isDeveloped,
          componentKey: t.componentKey,
        })),
        null,
        2
      )
    );
    console.log('DB', db.databaseName);
  } finally {
    await client.close();
  }
}

void run().catch((err) => {
  console.error(err);
  process.exit(1);
});
