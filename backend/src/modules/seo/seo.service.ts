import mongoose, { Types } from 'mongoose';
import { env } from '../../config/env';
import { AppError } from '../../middleware/error.middleware';
import { Category } from '../categories/category.model';
import { Tool } from '../tools/tool.model';
import {
  alignDraftContent,
  FINANCE_CATEGORY_SLUG,
  PILOT_MAX_TOOLS,
  seoContentSchema,
  type SeoContent,
} from './content';
import { buildPublishPatch } from './publish-patch';
import { assertSeoConfigured, enqueueSeoStep, type SeoQueueName } from './queue';
import { SeoCampaign, SeoDraft, type ISeoCampaign, type ISeoDraft, type SeoDraftStatus } from './seo.model';
import { validateDraft, type DraftValidation } from './validate-draft';

const TERMINAL = new Set(['needs_review', 'approved', 'published', 'rejected', 'failed']);

const RETRY_STATUS: Record<string, SeoDraftStatus> = {
  'seo-inventory': 'queued',
  'seo-keyword-research': 'researching',
  'seo-serp-analysis': 'serp',
  'seo-content-generation': 'generating',
  'seo-content-validation': 'validating',
};

const STEP_KEY: Record<string, string> = {
  'seo-inventory': 'inventory',
  'seo-keyword-research': 'keyword',
  'seo-serp-analysis': 'serp',
  'seo-content-generation': 'generate',
  'seo-content-validation': 'validate',
};

function campaignDto(doc: ISeoCampaign, draftCount = 0) {
  return {
    id: doc.id,
    name: doc.name,
    categoryId: String(doc.categoryId),
    maxTools: doc.maxTools,
    status: doc.status,
    locationCode: doc.locationCode,
    languageCode: doc.languageCode,
    draftCount,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function draftListDto(doc: ISeoDraft) {
  return {
    id: doc.id,
    toolId: String(doc.toolId),
    name: doc.snapshot?.name ?? '',
    slug: doc.snapshot?.slug ?? '',
    status: doc.status,
    primaryKeyword: doc.primaryKeyword ?? '',
    error: doc.error ?? '',
    callCounts: doc.callCounts ?? { keyword: 0, serp: 0, openai: 0 },
    validationOk: Boolean(doc.validation?.ok),
  };
}

function draftDetailDto(doc: ISeoDraft, campaign: ISeoCampaign) {
  return {
    ...draftListDto(doc),
    campaignId: String(doc.campaignId),
    failedStep: doc.failedStep ?? '',
    snapshot: doc.snapshot,
    secondaryKeywords: doc.secondaryKeywords ?? [],
    keywordFacts: doc.keywordFacts ?? [],
    serpItems: doc.serpItems ?? [],
    suggestedLinks: (doc.suggestedLinks ?? []).map((link) => ({ slug: link.slug, anchor: link.anchor })),
    content: doc.content ?? null,
    validation: doc.validation ?? { ok: false, issues: [] },
    locationCode: campaign.locationCode,
    languageCode: campaign.languageCode,
    reviewedAt: doc.reviewedAt ? doc.reviewedAt.toISOString() : null,
    publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function financeCategory() {
  const category = await Category.findOne({ slug: FINANCE_CATEGORY_SLUG, kind: 'category' });
  if (!category) {
    throw new AppError('Finance & Business category was not found.', 404, 'NOT_FOUND');
  }
  return category;
}

function requireId(id: string, label: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(`${label} was not found.`, 404, 'NOT_FOUND');
  }
  return new Types.ObjectId(id);
}

async function mustCampaign(id: string): Promise<ISeoCampaign> {
  const doc = await SeoCampaign.findById(requireId(id, 'Campaign'));
  if (!doc) throw new AppError('Campaign was not found.', 404, 'NOT_FOUND');
  return doc;
}

async function mustDraft(id: string): Promise<ISeoDraft> {
  const doc = await SeoDraft.findById(requireId(id, 'Draft'));
  if (!doc) throw new AppError('Draft was not found.', 404, 'NOT_FOUND');
  return doc;
}

async function slugNames(categoryId: Types.ObjectId, selfId: Types.ObjectId): Promise<Map<string, string>> {
  const tools = await Tool.find({
    category: categoryId,
    _id: { $ne: selfId },
    isActive: true,
    isDeveloped: true,
    componentKey: { $nin: [null, ''] },
  })
    .select('slug name')
    .lean<Array<{ slug?: string; name?: string }>>();
  const names = new Map<string, string>();
  for (const tool of tools) {
    if (tool.slug && tool.name) names.set(tool.slug, tool.name);
  }
  return names;
}

async function duplicatePrimary(draft: ISeoDraft, primary: string): Promise<boolean> {
  const peers = await SeoDraft.find({ campaignId: draft.campaignId, _id: { $ne: draft._id } }).select(
    'primaryKeyword content'
  );
  const key = primary.toLowerCase();
  return peers.some((peer) => {
    const peerPrimary = (peer.content?.primaryKeyword || peer.primaryKeyword || '').toLowerCase();
    return peerPrimary.length > 0 && peerPrimary === key;
  });
}

async function reviewValidation(draft: ISeoDraft, content: SeoContent): Promise<DraftValidation> {
  const campaign = await mustCampaign(String(draft.campaignId));
  return validateDraft({
    content,
    allowedKeywords: draft.keywordFacts.map((fact) => fact.keyword),
    lockedPrimary: draft.primaryKeyword,
    allowedSlugs: await slugNames(campaign.categoryId, draft.toolId),
    duplicatePrimary: await duplicatePrimary(draft, content.primaryKeyword),
  });
}

function isStandaloneTransactionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : '';
  return message.includes('replica set') || message.includes('Transaction numbers are only allowed');
}

async function refreshCampaign(campaignId: Types.ObjectId): Promise<void> {
  const drafts = await SeoDraft.find({ campaignId }).select('status');
  const status = drafts.every((row) => TERMINAL.has(row.status)) ? 'ready' : 'running';
  await SeoCampaign.updateOne({ _id: campaignId }, { $set: { status } });
}

export async function listEligibleTools() {
  const category = await financeCategory();
  const tools = await Tool.find({
    category: category._id,
    isActive: true,
    isDeveloped: true,
    componentKey: { $nin: [null, ''] },
  })
    .select('name slug pillar')
    .populate('pillar', 'name')
    .sort({ name: 1 })
    .lean<Array<{ _id: { toString(): string }; name: string; slug: string; pillar?: { name?: string } | null }>>();
  return tools.map((tool) => ({
    id: tool._id.toString(),
    name: tool.name,
    slug: tool.slug,
    pillarName: tool.pillar?.name ?? '',
  }));
}

export async function listCampaigns() {
  const campaigns = await SeoCampaign.find().sort({ createdAt: -1 }).limit(50);
  const counts = await SeoDraft.aggregate<{ _id: Types.ObjectId; count: number }>([
    { $group: { _id: '$campaignId', count: { $sum: 1 } } },
  ]);
  const byId = new Map(counts.map((row) => [String(row._id), row.count]));
  return campaigns.map((campaign) => campaignDto(campaign, byId.get(campaign.id) ?? 0));
}

export async function createCampaign(input: { name: string; toolIds: string[] }, adminId: string) {
  assertSeoConfigured();
  const uniqueIds = [...new Set(input.toolIds)];
  if (uniqueIds.length !== input.toolIds.length) {
    throw new AppError('Each calculator can be added once.', 400, 'VALIDATION_ERROR');
  }
  if (uniqueIds.length > PILOT_MAX_TOOLS) {
    throw new AppError(`A pilot campaign accepts at most ${PILOT_MAX_TOOLS} calculators.`, 400, 'VALIDATION_ERROR');
  }
  const category = await financeCategory();
  const objectIds = uniqueIds.map((id) => requireId(id, 'Tool'));
  const tools = await Tool.find({
    _id: { $in: objectIds },
    category: category._id,
    isActive: true,
    isDeveloped: true,
    componentKey: { $nin: [null, ''] },
  }).select('_id');
  if (tools.length !== uniqueIds.length) {
    throw new AppError(
      'Every tool must be an active, developed Finance & Business calculator.',
      400,
      'VALIDATION_ERROR'
    );
  }
  const campaign = await SeoCampaign.create({
    name: input.name,
    categoryId: category._id,
    maxTools: PILOT_MAX_TOOLS,
    status: 'running',
    locationCode: env.DATAFORSEO_LOCATION_CODE,
    languageCode: env.DATAFORSEO_LANGUAGE_CODE,
    createdBy: requireId(adminId, 'Admin'),
  });
  const drafts = await SeoDraft.insertMany(
    tools.map((tool) => ({
      campaignId: campaign._id,
      toolId: tool._id,
      status: 'queued' as const,
    }))
  );
  for (const draft of drafts) {
    await enqueueSeoStep('seo-inventory', draft.id);
  }
  return {
    campaign: campaignDto(campaign, drafts.length),
    drafts: drafts.map((draft) => draftListDto(draft)),
  };
}

export async function getCampaign(id: string) {
  const campaign = await mustCampaign(id);
  const drafts = await SeoDraft.find({ campaignId: campaign._id }).sort({ 'snapshot.name': 1 });
  return { campaign: campaignDto(campaign, drafts.length), drafts: drafts.map(draftListDto) };
}

export async function getDraft(id: string) {
  const draft = await mustDraft(id);
  const campaign = await mustCampaign(String(draft.campaignId));
  const parsed = seoContentSchema.safeParse(draft.content);
  if (parsed.success && draft.status === 'needs_review') {
    draft.validation = await reviewValidation(draft, parsed.data);
    await draft.save();
  }
  return draftDetailDto(draft, campaign);
}

export async function saveDraft(id: string, contentInput: unknown) {
  const draft = await mustDraft(id);
  if (draft.status === 'published') {
    throw new AppError('Unpublish the draft before editing it.', 409, 'CONFLICT');
  }
  const parsed = seoContentSchema.parse(contentInput);
  const campaign = await mustCampaign(String(draft.campaignId));
  const aligned = alignDraftContent(
    parsed,
    draft.keywordFacts.map((fact) => fact.keyword),
    await slugNames(campaign.categoryId, draft.toolId)
  );
  draft.content = aligned;
  draft.validation = await reviewValidation(draft, aligned);
  draft.status = 'needs_review';
  draft.error = '';
  await draft.save();
  await refreshCampaign(draft.campaignId);
  return draftDetailDto(draft, campaign);
}

export async function approveDraft(id: string, adminId: string) {
  const draft = await mustDraft(id);
  if (draft.status !== 'needs_review') {
    throw new AppError('Only a draft waiting for review can be approved.', 409, 'CONFLICT');
  }
  const parsed = seoContentSchema.safeParse(draft.content);
  if (!parsed.success) {
    throw new AppError('Draft content is incomplete.', 409, 'CONFLICT');
  }
  draft.validation = await reviewValidation(draft, parsed.data);
  if (!draft.validation.ok) {
    draft.status = 'needs_review';
    await draft.save();
    throw new AppError('Resolve the blocking checks before approval.', 409, 'CONFLICT');
  }
  draft.content = parsed.data;
  draft.status = 'approved';
  draft.reviewerId = requireId(adminId, 'Admin');
  draft.reviewedAt = new Date();
  await draft.save();
  const campaign = await mustCampaign(String(draft.campaignId));
  return draftDetailDto(draft, campaign);
}

async function applyPublish(draft: ISeoDraft, content: SeoContent): Promise<void> {
  const patch = buildPublishPatch(content);
  const write = async (session?: mongoose.ClientSession) => {
    const options = session ? { session } : undefined;
    await Tool.updateOne({ _id: draft.toolId }, { $set: patch }, options);
    await SeoDraft.updateMany(
      { toolId: draft.toolId, status: 'published', _id: { $ne: draft._id } },
      { $set: { status: 'approved' } },
      options
    );
    draft.status = 'published';
    draft.publishedAt = new Date();
    await draft.save(options);
  };

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await write(session);
    });
  } catch (error) {
    // ponytail: standalone MongoDB cannot run multi-document transactions. Sequential writes are the fallback.
    // Upgrade path: run Mongo as a replica set and delete this branch.
    if (!isStandaloneTransactionError(error)) throw error;
    await write();
  } finally {
    await session.endSession();
  }
}

export async function publishDraft(id: string) {
  const draft = await mustDraft(id);
  if (draft.status !== 'approved') {
    throw new AppError('Approve the draft before publishing it.', 409, 'CONFLICT');
  }
  const parsed = seoContentSchema.safeParse(draft.content);
  if (!parsed.success) {
    throw new AppError('Draft content is incomplete.', 409, 'CONFLICT');
  }
  const validation = await reviewValidation(draft, parsed.data);
  if (!validation.ok) {
    draft.validation = validation;
    draft.status = 'needs_review';
    await draft.save();
    throw new AppError('Blocking checks failed. The draft is back in review.', 409, 'CONFLICT');
  }
  draft.content = parsed.data;
  draft.validation = validation;
  await applyPublish(draft, parsed.data);
  await refreshCampaign(draft.campaignId);
  const campaign = await mustCampaign(String(draft.campaignId));
  return { draft: draftDetailDto(draft, campaign), slug: draft.snapshot.slug };
}

export async function unpublishDraft(id: string) {
  const draft = await mustDraft(id);
  if (draft.status !== 'published') {
    throw new AppError('Only a published draft can be unpublished.', 409, 'CONFLICT');
  }
  draft.status = 'approved';
  draft.publishedAt = null;
  await draft.save();
  const campaign = await mustCampaign(String(draft.campaignId));
  return { draft: draftDetailDto(draft, campaign), slug: draft.snapshot.slug };
}

export async function regenerateDraft(id: string, researchAgain: boolean) {
  assertSeoConfigured();
  const draft = await mustDraft(id);
  if (draft.status === 'published') {
    throw new AppError('Unpublish the draft before regenerating it.', 409, 'CONFLICT');
  }
  draft.error = '';
  draft.failedStep = '';
  if (researchAgain || !draft.primaryKeyword) {
    draft.completedSteps = draft.completedSteps.filter((step) => step === 'inventory');
    draft.keywordFacts = [];
    draft.keywordPayload = null;
    draft.primaryKeyword = '';
    draft.secondaryKeywords = [];
    draft.serpItems = [];
    draft.serpPayload = null;
    draft.content = null;
    draft.validation = { ok: false, issues: [] };
    if (draft.completedSteps.includes('inventory')) {
      draft.status = 'researching';
      await draft.save();
      await enqueueSeoStep('seo-keyword-research', draft.id);
    } else {
      draft.status = 'queued';
      await draft.save();
      await enqueueSeoStep('seo-inventory', draft.id);
    }
  } else {
    draft.completedSteps = draft.completedSteps.filter((step) => step !== 'generate' && step !== 'validate');
    draft.status = 'generating';
    await draft.save();
    await enqueueSeoStep('seo-content-generation', draft.id);
  }
  await refreshCampaign(draft.campaignId);
  const campaign = await mustCampaign(String(draft.campaignId));
  return draftDetailDto(draft, campaign);
}

export async function retryDraft(id: string) {
  assertSeoConfigured();
  const draft = await mustDraft(id);
  if (draft.status !== 'failed') {
    throw new AppError('Only a failed draft can be retried.', 409, 'CONFLICT');
  }
  const step = (draft.failedStep || 'seo-inventory') as SeoQueueName;
  const nextStatus = RETRY_STATUS[step] ?? 'queued';
  const stepKey = STEP_KEY[step];
  if (stepKey) {
    draft.completedSteps = draft.completedSteps.filter((item) => item !== stepKey);
  }
  draft.status = nextStatus;
  draft.error = '';
  draft.failedStep = '';
  await draft.save();
  await enqueueSeoStep(RETRY_STATUS[step] ? step : 'seo-inventory', draft.id);
  await refreshCampaign(draft.campaignId);
  const campaign = await mustCampaign(String(draft.campaignId));
  return draftDetailDto(draft, campaign);
}
