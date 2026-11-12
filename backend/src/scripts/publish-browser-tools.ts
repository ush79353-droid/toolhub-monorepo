import { connectDB, disconnectDB } from '../config/database';
import { Category } from '../modules/categories/category.model';
import { Tool } from '../modules/tools/tool.model';

const PER_CATEGORY = 15;
const FEATURED_TOTAL = 20;

const browserTool = { executionType: { $in: ['client', null] } };

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('Failed to connect to MongoDB.');

  try {
    const categories = await Category.find({ kind: 'category' }).sort({ name: 1 }).select('name');
    let activated = 0;

    for (const category of categories) {
      const tools = await Tool.find({ category: category._id, ...browserTool })
        .sort({ name: 1 })
        .select('name isActive');
      const already = tools.filter((tool) => tool.isActive).length;
      const needed = Math.max(0, PER_CATEGORY - already);
      const ids = tools.filter((tool) => !tool.isActive).slice(0, needed).map((tool) => tool._id);
      if (ids.length > 0) {
        await Tool.updateMany({ _id: { $in: ids } }, { $set: { isActive: true } });
        activated += ids.length;
      }
      const activeNow = Math.min(tools.length, already + ids.length);
      const short = tools.length < PER_CATEGORY ? ` (${tools.length} browser tools in this category)` : '';
      console.log(`${category.name}: ${activeNow} active${short}`);
    }

    const pool = await Tool.find({ ...browserTool, isActive: true }).select('name componentKey isFeatured');
    pool.sort((left, right) => {
      const rank = (tool: { componentKey: string; isFeatured: boolean }) =>
        tool.componentKey ? 0 : tool.isFeatured ? 1 : 2;
      const byRank = rank(left) - rank(right);
      if (byRank !== 0) return byRank;
      return left.name.localeCompare(right.name);
    });

    const chosen = pool.slice(0, FEATURED_TOTAL);
    const chosenIds = chosen.map((tool) => tool._id);
    const featuredOn = await Tool.updateMany({ _id: { $in: chosenIds } }, { $set: { isFeatured: true } });
    const featuredOff = await Tool.updateMany(
      { ...browserTool, _id: { $nin: chosenIds }, isFeatured: true },
      { $set: { isFeatured: false } }
    );

    console.log(`Activated ${activated} browser tools.`);
    console.log(`Featured ${chosen.length} tools (${featuredOn.modifiedCount} set, ${featuredOff.modifiedCount} cleared).`);
    for (const tool of chosen) console.log(`  featured: ${tool.name}`);
    if (chosen.length < FEATURED_TOTAL) {
      console.log(`Only ${chosen.length} active browser tools exist, so featured stops there.`);
    }
  } finally {
    await disconnectDB();
  }
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
