import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'binary-to-octal-converter';
const COMPONENT = 'BinaryToOctalConverter';
const DISPLAY_NAME = 'Binary to Octal Converter';
const EXPECTED_ID = '6af46f17a27d8d1d4e990be3';

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
    // Preserve existing isActive, indexable, and isFeatured publishing flags.
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Convert binary to octal and octal to binary with exact three-bit grouping and step-by-step breakdowns.';
    tool.metaTitle = 'Binary to Octal Converter – Convert Binary & Octal | Omega Calculators';
    tool.metaDescription =
      'Convert binary to octal and octal to binary instantly. Use our free converter with accurate results, 3-bit grouping, conversion steps, and examples.';
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
