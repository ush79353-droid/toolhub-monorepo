import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import { isApprovedComponentKey, toolNameKey } from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';

const SLUG = 'holding-period-return-calculator';
const COMPONENT = 'HoldingPeriodReturnCalculator';
const DISPLAY_NAME = 'Holding Period Return Calculator';
const EXPECTED_ID = '6af46f0fa27d8d1d4e9900d3';

const SHORT_DESCRIPTION =
  'Calculate capital gains yield, dividend yield, and holding period return from bought price, current price, and dividends.';
const META_TITLE = 'Holding Period Return Calculator | Omega Calculators';
const META_DESCRIPTION =
  'Free holding period return calculator for capital gains yield, dividend yield, and total HPR from share prices and dividends.';

async function run(): Promise<void> {
  if (!isApprovedComponentKey(COMPONENT)) {
    throw new Error(`Unapproved component ${COMPONENT}`);
  }
  if (META_TITLE.length > 70) throw new Error(`metaTitle length ${META_TITLE.length}`);
  if (META_DESCRIPTION.length > 160) {
    throw new Error(`metaDescription length ${META_DESCRIPTION.length}`);
  }

  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection failed');

  try {
    const tool = await Tool.findOne({ slug: SLUG });
    if (!tool) throw new Error(`Tool slug ${SLUG} not found`);
    if (tool.id !== EXPECTED_ID) {
      throw new Error(`Unexpected _id ${tool.id}; expected ${EXPECTED_ID}. Refusing overwrite.`);
    }

    tool.componentKey = COMPONENT;
    tool.executionType = 'client';
    tool.isDeveloped = true;
    tool.isActive = true;
    tool.indexable = true;
    tool.name = DISPLAY_NAME;
    tool.nameKey = toolNameKey(DISPLAY_NAME);
    tool.shortDescription = SHORT_DESCRIPTION;
    tool.metaTitle = META_TITLE;
    tool.metaDescription = META_DESCRIPTION;
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

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
