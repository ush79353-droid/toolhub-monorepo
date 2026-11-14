import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'cubic-yards-to-tons-calculator';
const COMPONENT = 'CubicYardsToTonsCalculator';
const DISPLAY_NAME = 'Cubic Yards to Tons Calculator';

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
    // Preserve existing isActive, indexable, isFeatured, category, pillar, and subPillar.
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Convert cubic yards to tons using material density. Supports metric tonnes, US short tons, and imperial long tons.';
    tool.metaTitle = 'Cubic Yards to Tons Calculator – yd³ to Tons | Omega Calculators';
    tool.metaDescription =
      'Convert cubic yards to tons using material density. Calculate soil, gravel, sand, and other material weights in metric, US short, or imperial tons.';
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
