import { connectDB, disconnectDB } from '../config/database';
import { Tool } from '../modules/tools/tool.model';

async function main() {
  await connectDB();
  const rows = await Tool.find({
    $or: [{ name: /^PSI Calculator$/i }, { slug: /psi-calculator|pneumonia-severity/i }],
  }).lean();
  console.log(
    JSON.stringify(
      rows.map((r) => ({
        _id: r._id,
        slug: r.slug,
        name: r.name,
        componentKey: r.componentKey,
        isActive: r.isActive,
        isDeveloped: r.isDeveloped,
        indexable: r.indexable,
        pillar: r.pillar,
        subPillar: r.subPillar,
      })),
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