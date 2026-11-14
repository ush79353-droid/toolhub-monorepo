import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'inches-to-fraction-calculator';
const COMPONENT = 'InchesToFractionCalculator';
const DISPLAY_NAME = 'Inches to Fraction Calculator';

async function run(): Promise<void> {
  if (!isApprovedComponentKey(COMPONENT)) {
    throw new Error(`Unapproved component ${COMPONENT}`);
  }

  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const tool = await Tool.findOne({ slug: SLUG });
    if (!tool) throw new Error(`Tool slug ${SLUG} not found`);

    tool.componentKey = COMPONENT;
    tool.executionType = 'client';
    tool.isDeveloped = true;
    // Preserve existing isActive, indexable, and isFeatured publishing flags.
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Convert decimal inches to fractions at 1/2 through 1/256 precision, with mixed numbers and metric equivalents.';
    tool.metaTitle = 'Inches to Fraction Calculator | Omega Calculators';
    tool.metaDescription =
      'Convert decimal inches to fractions instantly. Choose precision, get mixed fractions, decimals, and metric conversions.';
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
          category: tool.category,
          pillar: tool.pillar,
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
