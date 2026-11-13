import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'amortization-calculator';
const COMPONENT = 'AmortizationCalculator';
const DISPLAY_NAME = 'Amortization Calculator';

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
    (tool as any).isDeveloped = true;
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription =
      'Calculate loan amortization schedules, monthly payments, interest breakdowns, and extra payment savings with interactive charts.';
    tool.metaTitle = 'Amortization Calculator | Omega Calculators';
    tool.metaDescription =
      'Free amortization calculator with interactive schedules, balance charts, extra payment savings, and flexible compounding frequencies.';
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
          isDeveloped: (tool as any).isDeveloped,
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
