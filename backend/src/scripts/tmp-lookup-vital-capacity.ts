import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function main() {
  await connectDB();
  const slug = 'vital-capacity-calculator';
  const t =
    (await Tool.findOne({ slug }).lean()) ??
  (await Tool.findOne({ nameKey: 'vital capacity calculator' }).lean());
  if (!t) {
    console.log('NOT_FOUND');
    await disconnectDB();
    return;
  }
  console.log(
    JSON.stringify(
      {
        _id: String(t._id),
        slug: t.slug,
        name: t.name,
        componentKey: t.componentKey,
        isDeveloped: t.isDeveloped,
        isActive: t.isActive,
        indexable: t.indexable,
        pillar: t.pillar,
        subPillar: t.subPillar,
      },
      null,
      2,
    ),
  );
  await disconnectDB();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});