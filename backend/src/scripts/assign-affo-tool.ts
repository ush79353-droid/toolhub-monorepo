import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const EXISTING_SLUG = 'affo-calculator-adjusted-funds-from-operations';
const SLUG = 'affo-calculator';
const COMPONENT = 'AFFOCalculator';
const DISPLAY_NAME = 'AFFO Calculator — Adjusted Funds From Operations';

async function run(): Promise<void> {
  if (!isApprovedComponentKey(COMPONENT)) {
    throw new Error(`Unapproved component ${COMPONENT}`);
  }

  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const tool = await Tool.findOne({ $or: [{ slug: EXISTING_SLUG }, { slug: SLUG }] });
    if (!tool) throw new Error(`Tool slug ${EXISTING_SLUG} not found`);

    const slugTaken = await Tool.findOne({ slug: SLUG, _id: { $ne: tool._id } }).select('_id');
    if (slugTaken) throw new Error(`Slug ${SLUG} is already used by another tool`);

    tool.componentKey = COMPONENT;
    tool.executionType = 'client';
    tool.isActive = true;
    tool.indexable = true;
    tool.slug = SLUG;
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Estimate simplified REIT FFO and AFFO for one reporting period, without double-counting interest income or expenses already in net income.';
    tool.metaTitle = 'AFFO Calculator | Omega Calculators';
    tool.metaDescription =
      'Estimate simplified FFO and AFFO from net income, eligible depreciation, property-sale gains and losses, and recurring adjustments. Not a Nareit filing.';
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
          indexable: tool.indexable,
          embedEnabled: tool.embedEnabled,
        },
        null,
        2
      )
    );
  } finally {
    await disconnectDB();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
