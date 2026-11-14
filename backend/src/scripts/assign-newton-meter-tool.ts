import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'newton-meter-calculator';
const COMPONENT = 'NewtonMeterCalculator';
const DISPLAY_NAME = 'Newton Meter Calculator';
const EXPECTED_PILLAR = '6af451d0a27d8d1d4e98f9e3';

async function run(): Promise<void> {
  if (!isApprovedComponentKey(COMPONENT)) {
    throw new Error(`Unapproved component ${COMPONENT}`);
  }

  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const tool = await Tool.findOne({ slug: SLUG });
    if (!tool) throw new Error(`Tool slug ${SLUG} not found`);

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
      'Convert newton-meters (N·m) to foot-pounds (ft·lbf) and related torque units with exact SI definitions.';
    tool.metaTitle = 'Newton Meter Calculator – Nm to ft-lb Torque | Omega Calculators';
    tool.metaDescription =
      'Convert newton-meters (Nm) to foot-pounds (ft-lb) and other torque units instantly. Free Newton Meter Calculator with accurate formulas, examples, and FAQs.';
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
