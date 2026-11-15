import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'reduced-row-echelon-form-calculator';
const COMPONENT = 'RrefCalculator';
const DISPLAY_NAME = 'RREF (Reduced Row Echelon Form) Calculator';

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
      'Calculate reduced row echelon form with step-by-step Gauss–Jordan elimination, rank, pivot columns, and exact rational arithmetic.';
    // metaTitle maxLength 70 in Tool model
    tool.metaTitle = 'RREF Calculator – Reduced Row Echelon Form | Omega';
    tool.metaDescription =
      'Calculate reduced row echelon form with step-by-step Gauss-Jordan elimination. Find pivot columns, matrix rank, and exact RREF results.';
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
