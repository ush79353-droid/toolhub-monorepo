import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'grams-to-calories-calculator';
const COMPONENT = 'GramsToCaloriesCalculator';
const DISPLAY_NAME = 'Grams To Calories Calculator';
const EXPECTED_ID = '6af46f17a27d8d1d4e990bf7';

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
    if (tool.pillar != null) {
      throw new Error(`Expected pillar null; found ${String(tool.pillar)}`);
    }
    if (tool.subPillar != null) {
      throw new Error(`Expected subPillar null; found ${String(tool.subPillar)}`);
    }

    tool.componentKey = COMPONENT;
    tool.executionType = 'client';
    tool.isDeveloped = true;
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Convert grams of carbs, protein, fat, and alcohol into kilocalories (Atwater factors).';
    tool.metaTitle = 'Grams To Calories Calculator | Omega Calculators';
    tool.metaDescription =
      'Convert grams of carbohydrates, protein, fat, and alcohol into calories. Calculate total food energy instantly with our free grams to calories calculator.';
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

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
