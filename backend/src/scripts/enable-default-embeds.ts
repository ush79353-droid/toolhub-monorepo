/**
 * One-time correction after embed policy flipped from default-OFF to default-ON.
 *
 * Only touches allowlisted implemented calculators that still have embedEnabled: false
 * written under the old schema/form default. Catalog-only tools are left alone.
 *
 * Explicit admin disables after this policy change remain false and are not auto-reenabled
 * on subsequent runs if an operator sets them off again (re-run only if needed).
 *
 * Usage: npx tsx src/scripts/enable-default-embeds.ts
 */
import { connectDB, disconnectDB } from '../config/database';
import '../modules/categories/category.model';
import { APPROVED_COMPONENT_KEYS } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) {
    throw new Error('Failed to connect to MongoDB.');
  }

  try {
    const result = await Tool.updateMany(
      {
        componentKey: { $in: [...APPROVED_COMPONENT_KEYS] },
        embedEnabled: false,
      },
      { $set: { embedEnabled: true } }
    );

    console.log(
      `enable-default-embeds: matched=${result.matchedCount} modified=${result.modifiedCount} keys=${APPROVED_COMPONENT_KEYS.join(',')}`
    );
  } finally {
    await disconnectDB();
  }
}

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
