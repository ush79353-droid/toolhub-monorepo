import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'metric-converter';
const COMPONENT = 'MetricConverter';
const DISPLAY_NAME = 'Metric Converter';
const EXPECTED_ID = '6af46f17a27d8d1d4e990b01';
/** Live catalog pillar (brief listed …d2…; DB has …d1…). Preserve live. */
const EXPECTED_PILLAR = '6af451d1a27d8d1d4e98f9e8';

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
    if (tool.subPillar != null) {
      throw new Error(`Expected subPillar null; found ${String(tool.subPillar)}`);
    }

    tool.componentKey = COMPONENT;
    tool.executionType = 'client';
    tool.isDeveloped = true;
    // Preserve isActive, indexable, isFeatured, category, pillar, and subPillar.
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Convert metric and imperial units for length, mass, area, volume, temperature, and more.';
    // Schema metaTitle maxLength 70 — shortened vs full brief title.
    tool.metaTitle = 'Metric Converter (Length, Mass & More) | Omega Calculators';
    tool.metaDescription =
      'Convert metric and imperial units instantly. Use our free metric converter for length, weight, area, volume, temperature, speed, pressure, and more.';
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
