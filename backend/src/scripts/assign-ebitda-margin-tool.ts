/**
 * Activate EBITDA Margin Calculator on the existing catalog row.
 * Uses native MongoClient + explicit .env parse so cwd does not matter.
 */
import { MongoClient, ObjectId } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

const SLUG = 'ebitda-margin-calculator';
const COMPONENT = 'EbitdaMarginCalculator';
const DISPLAY_NAME = 'EBITDA Margin Calculator';
const EXPECTED_ID = '6af46f0fa27d8d1d4e98ff9f';
const META_TITLE = 'EBITDA Margin Calculator | Omega Calculators';
const META_DESCRIPTION =
  'Free EBITDA margin calculator. Divide EBITDA by total revenues with real currency conversion.';
const SHORT_DESCRIPTION =
  'Compute EBITDA margin as EBITDA divided by total revenues with flexible currencies.';

function toolNameKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function readMongoUri(): string {
  const envPath = path.resolve(__dirname, '../../.env');
  const raw = fs.readFileSync(envPath, 'utf8');
  const match = raw.match(/^MONGODB_URI=(.+)$/m);
  const uri = match?.[1]?.trim();
  if (!uri) throw new Error('MONGODB_URI missing in backend/.env');
  return uri;
}

async function run(): Promise<void> {
  if (META_TITLE.length > 70) throw new Error(`metaTitle length ${META_TITLE.length}`);
  if (META_DESCRIPTION.length > 160) {
    throw new Error(`metaDescription length ${META_DESCRIPTION.length}`);
  }

  const uri = readMongoUri();
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 45000,
    connectTimeoutMS: 45000,
  });
  await client.connect();

  try {
    const db = client.db();
    const tools = db.collection('tools');
    const tool = await tools.findOne({ slug: SLUG });
    if (!tool) throw new Error(`Tool slug ${SLUG} not found in ${db.databaseName}`);

    if (String(tool._id) !== EXPECTED_ID) {
      throw new Error(
        `Unexpected _id ${String(tool._id)}; expected ${EXPECTED_ID}. Refusing overwrite.`
      );
    }

    if (
      tool.componentKey &&
      tool.componentKey !== COMPONENT &&
      tool.isDeveloped
    ) {
      throw new Error(
        `Conflict: already developed with componentKey ${tool.componentKey}. Refusing overwrite.`
      );
    }

    const embedEnabled = tool.embedEnabled === false ? false : true;

    await tools.updateOne(
      { _id: new ObjectId(EXPECTED_ID) },
      {
        $set: {
          componentKey: COMPONENT,
          executionType: 'client',
          isDeveloped: true,
          isActive: true,
          indexable: true,
          name: DISPLAY_NAME,
          nameKey: toolNameKey(DISPLAY_NAME),
          shortDescription: SHORT_DESCRIPTION,
          metaTitle: META_TITLE,
          metaDescription: META_DESCRIPTION,
          embedEnabled,
        },
      }
    );

    const updated = await tools.findOne({ _id: new ObjectId(EXPECTED_ID) });
    console.log(
      JSON.stringify(
        {
          id: String(updated?._id),
          name: updated?.name,
          slug: updated?.slug,
          componentKey: updated?.componentKey,
          executionType: updated?.executionType,
          isActive: updated?.isActive,
          isDeveloped: updated?.isDeveloped,
          indexable: updated?.indexable,
          embedEnabled: updated?.embedEnabled,
          db: db.databaseName,
          metaTitleLen: updated?.metaTitle?.length,
          metaDescriptionLen: updated?.metaDescription?.length,
        },
        null,
        2
      )
    );
  } finally {
    await client.close();
  }
}

void run().catch((err) => {
  console.error(err);
  process.exit(1);
});
