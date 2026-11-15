import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const EXISTING_SLUG = 'hhi-calculator-herfindahl-hirschman-index-calculator';
const TARGET_SLUG = 'hhi-calculator';
const COMPONENT = 'HhiCalculator';
const DISPLAY_NAME = 'HHI Calculator (Herfindahl-Hirschman Index)';
const META_TITLE = 'HHI Calculator | Omega Calculators';
const META_DESCRIPTION =
  'Calculate the Herfindahl-Hirschman Index from firm market shares (percent). Free HHI concentration calculator.';
const SHORT_DESCRIPTION =
  'Estimate market concentration with the Herfindahl-Hirschman Index from firm share percentages.';

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
      (await Tool.findOne({
        nameKey: toolNameKey('HHI Calculator (Herfindahl-Hirschman Index Calculator)'),
      }));

    if (!tool) throw new Error('Existing HHI catalog row not found');

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
