import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const LEGACY_SLUG = 'mirr-calculator-modified-internal-rate-of-return';
const SLUG = 'mirr-calculator';
const COMPONENT = 'MirrCalculator';
const DISPLAY_NAME = 'MIRR Calculator';
const EXPECTED_ID = '6af46f0fa27d8d1d4e990016';
const META_TITLE = 'MIRR Calculator | Omega Calculators';
const META_DESCRIPTION =
  'Free MIRR calculator. Estimate modified IRR from financing and reinvestment rates, initial investment, and annual cash flows.';
const SHORT_DESCRIPTION =
  'Estimate modified IRR with financing and reinvestment rates plus annual cash flows.';

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
    const clash = await Tool.findOne({ slug: SLUG });
    if (clash && clash.id !== EXPECTED_ID) {
      throw new Error(`Slug ${SLUG} already used by ${clash.id}`);
    }

    const tool =
      (await Tool.findOne({ slug: LEGACY_SLUG })) ||
      (await Tool.findOne({ slug: SLUG })) ||
      (await Tool.findById(EXPECTED_ID));
    if (!tool) throw new Error(`Tool ${LEGACY_SLUG} / ${SLUG} not found`);

    if (tool.id !== EXPECTED_ID) {
      throw new Error(`Unexpected _id ${tool.id}; expected ${EXPECTED_ID}. Refusing overwrite.`);
    }

    tool.slug = SLUG;
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
          metaTitleLen: tool.metaTitle?.length,
          metaDescriptionLen: tool.metaDescription?.length,
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
