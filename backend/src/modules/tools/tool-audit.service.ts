import mongoose from 'mongoose';
import { AppError } from '../../middleware/error.middleware';
import type { SaveToolAuditInput } from '../../validation/tool-audit.schema';
import { Tool } from './tool.model';
import { ToolAudit, type IToolAudit } from './tool-audit.model';

export interface AuditCatalogTool {
  id: string;
  name: string;
  slug: string;
  category: string;
  componentKey: string;
  isDeveloped: boolean;
  isDevelopedPersisted: boolean;
}

export interface AuditHistoryEntry {
  ranAt: string;
  source: 'filesystem' | 'manifest';
  total: number;
  developed: number;
  notDeveloped: number;
  needsReview: number;
  newlyDeveloped: string[];
  regressed: string[];
}

export interface StoredAudit {
  ranAt: string;
  source: 'filesystem' | 'manifest';
  warning: string;
  totals: {
    total: number;
    developed: number;
    notDeveloped: number;
    needsReview: number;
    completionPercent: number;
  };
  categories: IToolAudit['categoryStats'];
  duplicates: IToolAudit['duplicates'];
  newlyDeveloped: string[];
  regressed: string[];
  updatedCount: number;
  rows: SaveToolAuditInput['rows'];
  history: AuditHistoryEntry[];
}

type CatalogDoc = {
  _id: { toString(): string };
  name: string;
  slug: string;
  componentKey?: string;
  isDeveloped?: boolean;
  category?: { name?: string } | null;
};

function isAuditRow(value: unknown): value is SaveToolAuditInput['rows'][number] {
  if (!value || typeof value !== 'object') return false;
  const row = value as { slug?: unknown; status?: unknown };
  return typeof row.slug === 'string' && typeof row.status === 'string';
}

function asRows(value: unknown): SaveToolAuditInput['rows'] {
  if (!Array.isArray(value)) return [];
  return value.filter(isAuditRow);
}

function historyFrom(doc: Pick<IToolAudit, 'ranAt' | 'source' | 'total' | 'developed' | 'notDeveloped' | 'needsReview' | 'newlyDeveloped' | 'regressed'>): AuditHistoryEntry {
  return {
    ranAt: doc.ranAt.toISOString(),
    source: doc.source,
    total: doc.total,
    developed: doc.developed,
    notDeveloped: doc.notDeveloped,
    needsReview: doc.needsReview,
    newlyDeveloped: doc.newlyDeveloped ?? [],
    regressed: doc.regressed ?? [],
  };
}

async function listHistory(): Promise<AuditHistoryEntry[]> {
  const runs = await ToolAudit.find({ kind: 'run' })
    .sort({ ranAt: -1 })
    .limit(20)
    .select('ranAt source total developed notDeveloped needsReview newlyDeveloped regressed')
    .lean();
  return runs.map((run) => historyFrom(run));
}

function toStored(doc: IToolAudit, history: AuditHistoryEntry[]): StoredAudit {
  return {
    ranAt: doc.ranAt.toISOString(),
    source: doc.source,
    warning: doc.warning ?? '',
    totals: {
      total: doc.total,
      developed: doc.developed,
      notDeveloped: doc.notDeveloped,
      needsReview: doc.needsReview,
      completionPercent: doc.completionPercent,
    },
    categories: doc.categoryStats ?? [],
    duplicates: doc.duplicates ?? { ids: [], slugs: [], routes: [], sharedComponents: [] },
    newlyDeveloped: doc.newlyDeveloped ?? [],
    regressed: doc.regressed ?? [],
    updatedCount: doc.updatedCount ?? 0,
    rows: asRows(doc.rows),
    history,
  };
}

export async function listAuditCatalog(): Promise<AuditCatalogTool[]> {
  const docs = await Tool.find({})
    .select('name slug componentKey isDeveloped category')
    .populate('category', 'name')
    .sort({ name: 1 })
    .lean<CatalogDoc[]>();

  return docs.map((doc) => {
    const persisted = Object.prototype.hasOwnProperty.call(doc, 'isDeveloped') && typeof doc.isDeveloped === 'boolean';
    return {
      id: String(doc._id),
      name: doc.name,
      slug: doc.slug,
      category: doc.category?.name || 'Uncategorized',
      componentKey: doc.componentKey ?? '',
      isDeveloped: persisted ? doc.isDeveloped === true : true,
      isDevelopedPersisted: persisted,
    };
  });
}

function statusChanges(previousRows: SaveToolAuditInput['rows'], nextRows: SaveToolAuditInput['rows']) {
  const previous = new Map(previousRows.map((row) => [row.slug, row.status]));
  const nextSlugs = new Set(nextRows.map((row) => row.slug));
  const newlyDeveloped: string[] = [];
  const regressed: string[] = [];

  for (const row of nextRows) {
    const before = previous.get(row.slug);
    if (before === undefined) {
      if (row.status === 'developed') newlyDeveloped.push(row.slug);
      continue;
    }
    if (before !== 'developed' && row.status === 'developed') newlyDeveloped.push(row.slug);
    if (before === 'developed' && row.status !== 'developed') regressed.push(row.slug);
  }

  for (const [slug, status] of previous) {
    if (status === 'developed' && !nextSlugs.has(slug)) regressed.push(slug);
  }

  return { newlyDeveloped, regressed };
}

export async function saveDevelopmentAudit(input: SaveToolAuditInput): Promise<StoredAudit> {
  const previous = await ToolAudit.findOne({ kind: 'latest' }).select('rows').lean<{ rows?: unknown } | null>();
  const changes = previous ? statusChanges(asRows(previous.rows), input.rows) : { newlyDeveloped: [], regressed: [] };

  const updateIds = new Set(input.updates.map((item) => item.id));
  const ops: mongoose.AnyBulkWriteOperation[] = [];

  for (const update of input.updates) {
    if (!mongoose.isValidObjectId(update.id)) continue;
    ops.push({
      updateOne: {
        filter: { _id: update.id, isDeveloped: { $ne: update.isDeveloped } },
        update: { $set: { isDeveloped: update.isDeveloped } },
      },
    });
  }

  for (const id of input.initializeIds) {
    if (!mongoose.isValidObjectId(id) || updateIds.has(id)) continue;
    ops.push({
      updateOne: {
        filter: { _id: id, isDeveloped: { $exists: false } },
        update: { $set: { isDeveloped: true } },
      },
    });
  }

  for (let index = 0; index < ops.length; index += 400) {
    await Tool.bulkWrite(ops.slice(index, index + 400), { ordered: false, timestamps: false });
  }

  await Tool.updateMany({ isDeveloped: { $exists: false } }, { $set: { isDeveloped: true } }, { timestamps: false });

  const ranAt = new Date();
  const summary = {
    ranAt,
    source: input.source,
    warning: input.warning,
    total: input.totals.total,
    developed: input.totals.developed,
    notDeveloped: input.totals.notDeveloped,
    needsReview: input.totals.needsReview,
    completionPercent: input.totals.completionPercent,
    updatedCount: input.updates.length,
    newlyDeveloped: changes.newlyDeveloped,
    regressed: changes.regressed,
    categoryStats: input.categories,
    duplicates: input.duplicates,
  };

  await ToolAudit.create({ kind: 'run', ...summary });
  const latest = await ToolAudit.findOneAndUpdate(
    { kind: 'latest' },
    { $set: { kind: 'latest', ...summary, rows: input.rows } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  if (!latest) throw new AppError('The audit report could not be saved.', 500, 'AUDIT_SAVE_FAILED');

  const stale = await ToolAudit.find({ kind: 'run' }).sort({ ranAt: -1 }).skip(20).select('_id').lean();
  if (stale.length > 0) {
    await ToolAudit.deleteMany({ _id: { $in: stale.map((doc) => doc._id) } });
  }

  return toStored(latest, await listHistory());
}

export async function getDevelopmentAudit(): Promise<StoredAudit | null> {
  const latest = await ToolAudit.findOne({ kind: 'latest' });
  if (!latest) return null;
  return toStored(latest, await listHistory());
}
