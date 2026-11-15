import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'torr-to-atm-conversion';
const COMPONENT = 'TorrToAtmConverter';
const DISPLAY_NAME = 'Torr to atm Conversion';
/** Live Mongo ATM Conversion pillar for this catalog row (task typo had …d0…; DB has …d1…). */
const EXPECTED_PILLAR = '6af451d1a27d8d1d4e98f9e5';
const EXPECTED_ID = '6af46f17a27d8d1d4e990af1';

async function run(): Promise<void> {
  if (!isApprovedComponentKey(COMPONENT)) {
    throw new Error(`Unapproved component ${COMPONENT}`);
  }

  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const tool = await Tool.findOne({ slug: SLUG });
    if (!tool) throw new Error(`Tool slug ${SLUG} not found`);

    if (tool.id !== EXPECTED_ID) {
      throw new Error(`Unexpected _id ${tool.id}; expected ${EXPECTED_ID}. Refusing overwrite.`);
    }

    const pillarId = tool.pillar?.toString?.() ?? String(tool.pillar);
    if (pillarId !== EXPECTED_PILLAR) {
      throw new Error(
        `Unexpected pillar ${pillarId}; expected ${EXPECTED_PILLAR}. Refusing to overwrite association.`
      );
    }
    if (tool.subPillar != null) {
      throw new Error(`Expected subPillar null; found ${String(tool.subPillar)}`);
    }

    tool.componentKey = COMPONENT;
    tool.executionType = 'client';
    tool.isDeveloped = true;
    // Preserve existing isActive, indexable, and isFeatured publishing flags.
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Convert Torr to atm and atmospheres to Torr with the exact 1 atm = 760 Torr definition.';
    tool.metaTitle = 'Torr to atm Converter – Pressure Conversion | Omega Calculators';
    tool.metaDescription =
      'Convert Torr to atm and atmospheres to Torr instantly. Free pressure converter with exact formulas, conversion tables, examples, and FAQs.';
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
          pillar: pillarId,
          subPillar: tool.subPillar,
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
