import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const EXISTING_SLUG = 'customer-acquisition-cost-calculator-cac-calculator';
const TARGET_SLUG = 'customer-acquisition-cost-calculator';
const COMPONENT = 'CustomerAcquisitionCostCalculator';
const DISPLAY_NAME = 'Customer Acquisition Cost Calculator';
const META_TITLE = 'Customer Acquisition Cost Calculator | Omega Calculators';
const META_DESCRIPTION =
  'Calculate CAC from marketing cost, sales cost, and new customers. Free customer acquisition cost calculator.';
const SHORT_DESCRIPTION =
  'Estimate customer acquisition cost from marketing spend, sales spend, and new customers.';

async function run(): Promise<void> {
  if (META_TITLE.length > 70) throw new Error(`metaTitle length ${META_TITLE.length}`);
  if (META_DESCRIPTION.length > 160) throw new Error(`metaDescription length ${META_DESCRIPTION.length}`);
  if (!isApprovedComponentKey(COMPONENT)) {
    throw new Error(`Unapproved component ${COMPONENT}`);
  }

  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const tool =
      (await Tool.findOne({ slug: EXISTING_SLUG })) ||
      (await Tool.findOne({ slug: TARGET_SLUG })) ||
      (await Tool.findOne({ nameKey: toolNameKey('Customer Acquisition Cost Calculator – CAC Calculator') }));

    if (!tool) throw new Error(`Existing CAC catalog row not found`);

    const slugConflict = await Tool.findOne({
      slug: TARGET_SLUG,
      _id: { $ne: tool._id },
    });
    if (slugConflict) {
      throw new Error(`Target slug ${TARGET_SLUG} already used by another tool`);
    }

    tool.slug = TARGET_SLUG;
    tool.componentKey = COMPONENT;
    tool.executionType = 'client';
    tool.isDeveloped = true;
    tool.isActive = true;
    tool.indexable = true;
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription = SHORT_DESCRIPTION;
    tool.metaTitle = META_TITLE;
    tool.metaDescription = META_DESCRIPTION;
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

void run().catch((err) => {
  console.error(err);
  process.exit(1);
});
