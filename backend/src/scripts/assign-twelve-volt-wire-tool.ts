import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = '12-volt-wire-size-calculator';
const COMPONENT = 'TwelveVoltWireCalculator';
const DISPLAY_NAME = '12 Volt Wire Size Calculator';

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
    tool.isActive = true;
    tool.indexable = true;
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Estimate 12 V DC wire area from current, one-way length, material, and voltage-drop limit.';
    tool.metaTitle = '12 Volt Wire Size Calculator | Omega Calculators';
    tool.metaDescription =
      'Calculate 12V DC wire size using current, cable length, conductor material and voltage-drop limits. Estimate AWG, mm², voltage loss and wire resistance.';
    if (tool.embedEnabled !== false) tool.embedEnabled = true;

    await tool.save();
    console.log(
      JSON.stringify(
        {
          id: tool.id,
          name: tool.name,
          slug: tool.slug,
          componentKey: tool.componentKey,
          isActive: tool.isActive,
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

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
