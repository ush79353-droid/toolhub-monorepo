const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const env = fs.readFileSync(path.resolve(__dirname, '../../.env'), 'utf8');
const uri = env.match(/MONGODB_URI=(.*)/)[1].trim();

(async () => {
  const c = new MongoClient(uri);
  await c.connect();
  const col = c.db().collection('tools');
  const bySlug = await col.findOne({ slug: 'cagr-calculator' });
  const byName = await col.findOne({ name: /CAGR/i });
  console.log('bySlug:', JSON.stringify(bySlug, null, 2));
  console.log('byName:', JSON.stringify(byName && { _id: byName._id, slug: byName.slug, name: byName.name, componentKey: byName.componentKey, isActive: byName.isActive, isDeveloped: byName.isDeveloped }, null, 2));
  await c.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
