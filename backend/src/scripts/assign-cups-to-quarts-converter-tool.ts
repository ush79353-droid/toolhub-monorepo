import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'cups-to-quarts-converter';
const COMPONENT = 'CupsToQuartsConverter';
const DISPLAY_NAME = 'Cups to Quarts Converter';
const EXPECTED_ID = '6af46f17a27d8d1d4e990b35';
/** Brief pillar/subPillar are null. */
const EXPECTED_PILLAR: string | null = null;
const EXPECTED_SUBPILLAR: string | null = null;

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

    const pillarId = tool.pillar != null ? String(tool.pillar) : null;
    if (pillarId !== EXPECTED_PILLAR) {
      throw new Error(
        `Expected pillar ${EXPECTED_PILLAR}; found ${pillarId ?? 'null'}. Refusing overwrite.`,
      );
    }
    const subPillarId = tool.subPillar != null ? String(tool.subPillar) : null;
    if (subPillarId !== EXPECTED_SUBPILLAR) {
      throw new Error(
        `Expected subPillar ${EXPECTED_SUBPILLAR}; found ${subPillarId ?? 'null'}. Refusing overwrite.`,
      );
    }

    tool.componentKey = COMPONENT;
    tool.executionType = 'client';
    tool.isDeveloped = true;
    // Preserve isActive, indexable, isFeatured, category, pillar, and subPillar.
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Convert cups to quarts — and back — with US, metric, and UK cups plus US liquid, dry, and imperial quarts.';
    // Schema metaTitle maxLength 70.
    tool.metaTitle = 'Cups to Quarts Converter | Omega Calculators';
    // Schema metaDescription maxLength 160.
    tool.metaDescription =
      'Convert cups to quarts instantly with our free calculator. Supports US customary, metric, and imperial measurement systems.';
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
