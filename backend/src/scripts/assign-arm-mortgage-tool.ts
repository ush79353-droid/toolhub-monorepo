import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'arm-mortgage-calculator';
const COMPONENT = 'ArmMortgageCalculator';
const DISPLAY_NAME = 'ARM Mortgage Calculator';

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
      'Estimate adjustable-rate mortgage payments, modeled resets, caps, and amortization in your browser.';
    tool.metaTitle = 'ARM Mortgage Calculator | Omega Calculators';
    tool.metaDescription =
      'Estimate adjustable-rate mortgage payments, rate changes, total interest, and amortization with an ARM mortgage calculator.';
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
