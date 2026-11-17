import { MongoClient, ObjectId } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

const SLUG = 'immediate-annuity-calculator';
const COMPONENT = 'ImmediateAnnuityCalculator';
const DISPLAY_NAME = 'Immediate Annuity Calculator';
const EXPECTED_ID = '6af46f0fa27d8d1d4e98ffad';
const META_TITLE = 'Immediate Annuity Calculator | Omega Calculators';
const META_DESCRIPTION =
  'Free immediate annuity calculator. Solve withdrawals, investment, duration, return, or remaining balance with real FX.';
const SHORT_DESCRIPTION =
  'Solve immediate annuity withdrawals, required investment, duration, return, or remaining balance with a yearly schedule.';

function toolNameKey(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function readMongoUri() {
  const envPath = path.resolve(process.cwd(), 'backend/.env');
  const raw = fs.readFileSync(envPath, 'utf8');
  const match = raw.match(/^MONGODB_URI=(.+)$/m);
  const uri = match?.[1]?.trim();
  if (!uri) throw new Error('MONGODB_URI missing');
  return uri;
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
  if (!tool) throw new Error(`missing ${SLUG}`);
  if (String(tool._id) !== EXPECTED_ID) {
    throw new Error(`id mismatch ${tool._id}`);
  }
  if (tool.componentKey && tool.componentKey !== COMPONENT && tool.isDeveloped) {
    throw new Error(`conflict ${tool.componentKey}`);
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
        id: String(updated._id),
        slug: updated.slug,
        componentKey: updated.componentKey,
        isActive: updated.isActive,
        isDeveloped: updated.isDeveloped,
        indexable: updated.indexable,
        embedEnabled: updated.embedEnabled,
      },
      null,
      2
    )
  );
} finally {
  await client.close();
}
