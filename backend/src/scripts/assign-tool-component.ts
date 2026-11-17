/**
 * Reusable catalog assign / activation script.
 *
 * Usage (from backend/):
 *   npm run tool:assign -- \
 *     --slug days-to-years-calculator \
 *     --component DaysToYearsCalculator \
 *     --id 6af46f17a27d8d1d4e990ba8 \
 *     --name "Days to Years Calculator" \
 *     --short-description "Convert days to years…" \
 *     --meta-title "Days to Years Calculator | Omega Calculators" \
 *     --meta-description "Convert days to years instantly…" \
 *     --expected-pillar null \
 *     --expected-subpillar null
 *
 * Optional flags:
 *   --execution client|server|third-party   (default: client)
 *   --set-active                            (sets isActive=true; otherwise preserved)
 *   --set-indexable                         (sets indexable=true; otherwise preserved)
 *   --unset-indexable                       (sets indexable=false)
 *   --no-developed                          (skip isDeveloped=true)
 *   --no-embed                              (sets embedEnabled=false)
 *
 * Do NOT create per-tool assign-*-tool.ts scripts. Pass content via these flags.
 */
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB, disconnectDB } from '../config/database';
import {
  isApprovedComponentKey,
  isToolSlug,
  toolNameKey,
} from '../modules/tools/tool.key';
import { Tool } from '../modules/tools/tool.model';
import type { ToolExecutionType } from '../types/tool';

const META_TITLE_MAX = 70;
const META_DESCRIPTION_MAX = 160;

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function requireArg(flag: string): string {
  const value = (argValue(flag) ?? '').trim();
  if (!value) {
    throw new Error(`Missing required ${flag}`);
  }
  return value;
}

/** Parse `null` / empty / ObjectId-looking string for expected placement checks. */
function parseExpectedId(raw: string | undefined): string | null | undefined {
  if (raw === undefined) return undefined;
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned.toLowerCase() === 'null') return null;
  return cleaned;
}

function assertLen(label: string, value: string, max: number): void {
  if (value.length > max) {
    throw new Error(`${label} length ${value.length} exceeds max ${max}`);
  }
}

async function run(): Promise<void> {
  const slug = requireArg('--slug').toLowerCase();
  const componentKey = requireArg('--component');
  const expectedId = requireArg('--id');
  const displayName = requireArg('--name');
  const shortDescription = requireArg('--short-description');
  const metaTitle = requireArg('--meta-title');
  const metaDescription = requireArg('--meta-description');
  const executionType = (argValue('--execution') ?? 'client').trim() as ToolExecutionType;

  const expectedPillar = parseExpectedId(argValue('--expected-pillar'));
  const expectedSubPillar = parseExpectedId(argValue('--expected-subpillar'));

  const setActive = hasFlag('--set-active');
  const setIndexable = hasFlag('--set-indexable');
  const unsetIndexable = hasFlag('--unset-indexable');
  const skipDeveloped = hasFlag('--no-developed');
  const disableEmbed = hasFlag('--no-embed');

  if (!isToolSlug(slug)) {
    throw new Error(`Invalid --slug "${slug}"`);
  }
  if (!isApprovedComponentKey(componentKey)) {
    throw new Error(`Unapproved --component "${componentKey}" (register in tool.key.ts first)`);
  }
  if (!['client', 'server', 'third-party'].includes(executionType)) {
    throw new Error(`Invalid --execution "${executionType}"`);
  }
  if (setIndexable && unsetIndexable) {
    throw new Error('Use only one of --set-indexable / --unset-indexable');
  }
  assertLen('--meta-title', metaTitle, META_TITLE_MAX);
  assertLen('--meta-description', metaDescription, META_DESCRIPTION_MAX);

  const connected = await connectDB();
  if (!connected) {
    throw new Error('MongoDB connection failed');
  }

  try {
    const tool = await Tool.findOne({ slug });
    if (!tool) {
      throw new Error(`Tool slug ${slug} not found`);
    }
    if (tool.id !== expectedId) {
      throw new Error(`Unexpected _id ${tool.id}; expected ${expectedId}. Refusing overwrite.`);
    }

    if (expectedPillar !== undefined) {
      const pillarId = tool.pillar != null ? String(tool.pillar) : null;
      if (pillarId !== expectedPillar) {
        throw new Error(
          `Expected pillar ${expectedPillar}; found ${pillarId ?? 'null'}. Refusing overwrite.`,
        );
      }
    }
    if (expectedSubPillar !== undefined) {
      const subPillarId = tool.subPillar != null ? String(tool.subPillar) : null;
      if (subPillarId !== expectedSubPillar) {
        throw new Error(
          `Expected subPillar ${expectedSubPillar}; found ${subPillarId ?? 'null'}. Refusing overwrite.`,
        );
      }
    }

    tool.componentKey = componentKey;
    tool.executionType = executionType;
    tool.name = displayName;
    tool.nameKey = toolNameKey(displayName);
    tool.shortDescription = shortDescription;
    tool.metaTitle = metaTitle;
    tool.metaDescription = metaDescription;

    if (!skipDeveloped) {
      tool.isDeveloped = true;
    }
    if (setActive) {
      tool.isActive = true;
    }
    if (setIndexable) {
      tool.indexable = true;
    } else if (unsetIndexable) {
      tool.indexable = false;
    }
    // Preserve isActive / indexable / isFeatured / category / pillar / subPillar otherwise.

    if (disableEmbed) {
      tool.embedEnabled = false;
    } else if (tool.embedEnabled !== false) {
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

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
