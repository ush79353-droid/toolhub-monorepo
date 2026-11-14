import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'additional-funds-needed-calculator';
const COMPONENT = 'AdditionalFundsNeededCalculator';
const DISPLAY_NAME = 'Additional Funds Needed Calculator';

async function run(): Promise<void> {
  if (!isApprovedComponentKey(COMPONENT)) {
    throw new Error(`Unapproved component ${COMPONENT}`);
  }

  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const tool = await Tool.findOne({
      $or: [{ slug: SLUG }, { name: DISPLAY_NAME }, { nameKey: toolNameKey(DISPLAY_NAME) }],
    });
    if (!tool) throw new Error(`Tool ${DISPLAY_NAME} / ${SLUG} not found`);

    const slugTaken = await Tool.findOne({ slug: SLUG, _id: { $ne: tool._id } }).select('_id');
    if (slugTaken) throw new Error(`Slug ${SLUG} is already used by another tool`);

    tool.componentKey = COMPONENT;
    tool.executionType = 'client';
    tool.isDeveloped = true;
    tool.isActive = true;
    tool.indexable = true;
    tool.slug = SLUG;
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Estimate additional funds needed from the change in assets, liabilities, and retained earnings using AFN = ΔA − ΔL − ΔRE.';
    tool.metaTitle = 'Additional Funds Needed Calculator | Omega Calculators';
    tool.metaDescription =
      'Calculate additional funds needed (AFN) from asset, liability, and retained-earnings changes. Free simplified AFN calculator with examples and guide.';
    if (tool.embedEnabled !== false) {
      tool.embedEnabled = true;
    }

    await tool.save();

    console.log(
      JSON.stringify(
        {
          id: tool.id,
          name: tool.name,
          slug: tool.slug,
          componentKey: tool.componentKey,
          executionType: tool.executionType,
          isActive: tool.isActive,
          isDeveloped: tool.isDeveloped,
          indexable: tool.indexable,
          isFeatured: tool.isFeatured,
          embedEnabled: tool.embedEnabled,
          pillar: tool.pillar,
          subPillar: tool.subPillar,
          category: tool.category,
          metaTitleLen: tool.metaTitle?.length,
          metaDescriptionLen: tool.metaDescription?.length,
        },
        null,
        2,
      ),
    );
  } finally {
    await disconnectDB();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
