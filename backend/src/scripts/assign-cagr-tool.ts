import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const EXPECTED_ID = '6af46f0fa27d8d1d4e9900c5';
const EXISTING_SLUG = 'cagr-calculator-compound-annual-growth-rate';
const TARGET_SLUG = 'cagr-calculator';
const COMPONENT = 'CagrCalculator';
const DISPLAY_NAME = 'CAGR Calculator (Compound Annual Growth Rate)';
const META_TITLE = 'CAGR Calculator | Omega Calculators';
const META_DESCRIPTION =
  'Calculate compound annual growth rate from initial value, final value, and periods, or solve any missing field.';
const SHORT_DESCRIPTION =
  'Solve CAGR, periods, initial value, or final value from any three inputs with optional change-in-value details.';

async function run(): Promise<void> {
  if (META_TITLE.length > 70) throw new Error(`metaTitle length ${META_TITLE.length}`);
  if (META_DESCRIPTION.length > 160) {
    throw new Error(`metaDescription length ${META_DESCRIPTION.length}`);
  }
  if (!isApprovedComponentKey(COMPONENT)) {
    throw new Error(`Unapproved component ${COMPONENT}`);
  }

  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const tool =
      (await Tool.findOne({ slug: EXISTING_SLUG })) ||
      (await Tool.findOne({ slug: TARGET_SLUG })) ||
      (await Tool.findById(EXPECTED_ID));

    if (!tool) throw new Error('Existing CAGR catalog row not found');
    if (tool.id !== EXPECTED_ID) {
      throw new Error(`Unexpected _id ${tool.id}; expected ${EXPECTED_ID}. Refusing overwrite.`);
    }

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
