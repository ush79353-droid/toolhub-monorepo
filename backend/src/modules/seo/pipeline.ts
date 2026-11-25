import { Types } from 'mongoose';
import { env } from '../../config/env';
import { Category } from '../categories/category.model';
import { Tool } from '../tools/tool.model';
import { choosePrimaryKeyword, chooseSecondaryKeywords, keywordContainsSeed, keywordSeed, pickSiblingLinks } from './choose-keyword';
import { alignDraftContent, seoContentSchema } from './content';
import { fetchKeywordSuggestions, fetchOrganicSerp, parseKeywordIdeas, parseOrganicSerp } from './dataforseo.client';
import { draftSeoContent } from './openai.client';
import { enqueueSeoStep } from './queue';
import { SeoCampaign, SeoDraft, SeoProviderCache, type ISeoDraft } from './seo.model';
import { validateDraft } from './validate-draft';

function done(draft: ISeoDraft, step: string): boolean {
  return draft.completedSteps.includes(step);
}

function mark(draft: ISeoDraft, step: string) {
  if (!draft.completedSteps.includes(step)) draft.completedSteps.push(step);
}

async function loadDraft(draftId: string): Promise<ISeoDraft | null> {
  if (!Types.ObjectId.isValid(draftId)) return null;
  return SeoDraft.findById(draftId);
}

async function eligibleSlugNames(categoryId: Types.ObjectId, selfId: Types.ObjectId): Promise<Map<string, string>> {
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

async function namesForDraft(draft: ISeoDraft): Promise<Map<string, string>> {
  const tool = await Tool.findById(draft.toolId).select('category');
  if (!tool?.category) return new Map(draft.suggestedLinks.map((link) => [link.slug, link.anchor]));
  return eligibleSlugNames(tool.category, draft.toolId);
}

export async function runInventory(draftId: string): Promise<void> {
  const draft = await loadDraft(draftId);
  if (!draft) return;
  if (done(draft, 'inventory')) {
    if (draft.status === 'researching') await enqueueSeoStep('seo-keyword-research', draft.id);
    return;
  }
  if (draft.status !== 'queued') return;

  const tool = await Tool.findById(draft.toolId).select('name slug shortDescription componentKey pillar category');
  if (!tool) throw new Error('Tool for this SEO draft no longer exists.');
  const [pillar, category] = await Promise.all([
    tool.pillar ? Category.findById(tool.pillar).select('name') : null,
    tool.category ? Category.findById(tool.category).select('slug') : null,
  ]);

  const siblings = await Tool.find({
    category: tool.category,
    _id: { $ne: tool._id },
    isActive: true,
    isDeveloped: true,
    componentKey: { $nin: [null, ''] },
  })
    .select('name slug pillar')
    .lean<Array<{ _id: { toString(): string }; name?: string; slug?: string; pillar?: { toString(): string } | null }>>();

  const others = await SeoDraft.find({ campaignId: draft.campaignId, _id: { $ne: draft._id } }).select('suggestedLinks');
  const inbound = new Map<string, number>();
  for (const other of others) {
    for (const link of other.suggestedLinks) {
      inbound.set(link.toolId, (inbound.get(link.toolId) ?? 0) + 1);
    }
  }
  const pillarId = tool.pillar ? String(tool.pillar) : '';
  draft.snapshot = {
    name: tool.name,
    slug: tool.slug,
    pillarName: pillar?.name ?? '',
    shortDescription: tool.shortDescription ?? '',
    componentKey: tool.componentKey ?? '',
    categorySlug: category?.slug ?? 'finance-business',
  };
  draft.suggestedLinks = pickSiblingLinks(
    siblings.flatMap((sibling) => {
      if (!sibling.slug || !sibling.name) return [];
      return [
        {
          toolId: sibling._id.toString(),
          slug: sibling.slug,
          name: sibling.name,
          samePillar: Boolean(pillarId) && String(sibling.pillar ?? '') === pillarId,
        },
      ];
    }),
    inbound
  );
  draft.error = '';
  draft.failedStep = '';
  mark(draft, 'inventory');
  draft.status = 'researching';
  await draft.save();
  await enqueueSeoStep('seo-keyword-research', draft.id);
}

export async function runKeywordResearch(draftId: string): Promise<void> {
  const draft = await loadDraft(draftId);
  if (!draft) return;
  if (done(draft, 'keyword')) {
    if (draft.status === 'serp') await enqueueSeoStep('seo-serp-analysis', draft.id);
    return;
  }
  if (draft.status !== 'researching') return;
  const campaign = await SeoCampaign.findById(draft.campaignId).select('locationCode languageCode');
  const location = campaign?.locationCode ?? env.DATAFORSEO_LOCATION_CODE;
  const language = campaign?.languageCode ?? env.DATAFORSEO_LANGUAGE_CODE;
  const seed = keywordSeed(draft.snapshot.name);
  const cacheKey = `keyword:suggest:${location}:${language}:${seed.toLowerCase()}`;
  let raw = await readCache(cacheKey);
  if (!raw) {
    raw = await fetchKeywordSuggestions(seed, location, language);
    await writeCache(cacheKey, 'keyword', raw);
    draft.callCounts.keyword += 1;
  }
  const facts = parseKeywordIdeas(raw).filter((fact) => keywordContainsSeed(fact.keyword, seed));
  const peers = await SeoDraft.find({
    campaignId: draft.campaignId,
    _id: { $ne: draft._id },
    primaryKeyword: { $nin: ['', null] },
  }).select('primaryKeyword');
  const taken = new Set(peers.map((peer) => peer.primaryKeyword.toLowerCase()));
  const primary = choosePrimaryKeyword(facts, draft.snapshot.name, taken);
  draft.keywordPayload = raw;
  draft.keywordFacts = facts;
  if (!primary) {
    draft.primaryKeyword = '';
    draft.secondaryKeywords = [];
    draft.error = 'No keyword idea matches this tool name, so this draft was left for review.';
    draft.validation = {
      ok: false,
      issues: [{ code: 'keyword_match', message: draft.error, severity: 'block' }],
    };
    mark(draft, 'keyword');
    draft.status = 'needs_review';
    await draft.save();
    await refreshCampaign(draft.campaignId);
    await releaseCampaignTurn(draft.campaignId, draft._id);
    return;
  }
  const secondary = chooseSecondaryKeywords(facts, primary.keyword, draft.snapshot.name, taken);
  draft.keywordPayload = raw;
  draft.keywordFacts = facts;
  draft.primaryKeyword = primary.keyword;
  draft.secondaryKeywords = secondary.map((fact) => fact.keyword);
  draft.error = '';
  mark(draft, 'keyword');
  draft.status = 'serp';
  await draft.save();
  await enqueueSeoStep('seo-serp-analysis', draft.id);
}

export async function runSerpAnalysis(draftId: string): Promise<void> {
  const draft = await loadDraft(draftId);
  if (!draft) return;
  if (done(draft, 'serp')) {
    if (draft.status === 'generating') await enqueueSeoStep('seo-content-generation', draft.id);
    return;
  }
  if (draft.status !== 'serp') return;
  if (!draft.primaryKeyword) throw new Error('SERP analysis requires a primary keyword.');
  const campaignDoc = await SeoCampaign.findById(draft.campaignId).select('locationCode languageCode');
  const location = campaignDoc?.locationCode ?? env.DATAFORSEO_LOCATION_CODE;
  const language = campaignDoc?.languageCode ?? env.DATAFORSEO_LANGUAGE_CODE;
  const cacheKey = `serp:${location}:${language}:${draft.primaryKeyword.toLowerCase()}`;
  let raw = await readCache(cacheKey);
  if (!raw) {
    raw = await fetchOrganicSerp(draft.primaryKeyword, location, language);
    await writeCache(cacheKey, 'serp', raw);
    draft.callCounts.serp += 1;
  }
  draft.serpPayload = raw;
  draft.serpItems = parseOrganicSerp(raw);
  draft.error = '';
  mark(draft, 'serp');
  draft.status = 'generating';
  await draft.save();
  await enqueueSeoStep('seo-content-generation', draft.id);
}

export async function runContentGeneration(draftId: string): Promise<void> {
  const draft = await loadDraft(draftId);
  if (!draft) return;
  if (done(draft, 'generate')) {
    if (draft.status === 'validating') await enqueueSeoStep('seo-content-validation', draft.id);
    return;
  }
  if (draft.status !== 'generating') return;
  if (!draft.primaryKeyword) throw new Error('Content generation requires keyword research.');
  const drafted = await draftSeoContent({
    snapshot: draft.snapshot,
    primaryKeyword: draft.primaryKeyword,
    secondaryKeywords: draft.secondaryKeywords,
    keywordFacts: draft.keywordFacts,
    serpItems: draft.serpItems,
    suggestedLinks: draft.suggestedLinks,
  });
  const content = drafted.content;
  const names = await namesForDraft(draft);
  draft.content = alignDraftContent(
    content,
    draft.keywordFacts.map((fact) => fact.keyword),
    names
  );
  draft.callCounts.openai += drafted.calls;
  draft.error = '';
  mark(draft, 'generate');
  draft.completedSteps = draft.completedSteps.filter((step) => step !== 'validate');
  draft.status = 'validating';
  await draft.save();
  await enqueueSeoStep('seo-content-validation', draft.id);
}

export async function runContentValidation(draftId: string): Promise<void> {
  const draft = await loadDraft(draftId);
  if (!draft || draft.status !== 'validating') return;
  const parsed = seoContentSchema.safeParse(draft.content);
  if (!parsed.success) {
    draft.validation = {
      ok: false,
      issues: [{ code: 'content_shape', message: 'Draft content does not match the SEO schema.', severity: 'block' }],
    };
    draft.status = 'needs_review';
    mark(draft, 'validate');
    await draft.save();
    await refreshCampaign(draft.campaignId);
    await releaseCampaignTurn(draft.campaignId, draft._id);
    return;
  }
  const names = await namesForDraft(draft);
  const peers = await SeoDraft.find({ campaignId: draft.campaignId, _id: { $ne: draft._id } }).select(
    'primaryKeyword content'
  );
  const primary = parsed.data.primaryKeyword.toLowerCase();
  const duplicatePrimary = peers.some((peer) => {
    const peerPrimary = (peer.content?.primaryKeyword || peer.primaryKeyword || '').toLowerCase();
    return peerPrimary.length > 0 && peerPrimary === primary;
  });
  draft.content = parsed.data;
  draft.validation = validateDraft({
    content: parsed.data,
    allowedKeywords: draft.keywordFacts.map((fact) => fact.keyword),
    lockedPrimary: draft.primaryKeyword,
    allowedSlugs: names,
    duplicatePrimary,
  });
  draft.error = '';
  mark(draft, 'validate');
  draft.status = 'needs_review';
  await draft.save();
  await refreshCampaign(draft.campaignId);
  await releaseCampaignTurn(draft.campaignId, draft._id);
}

async function readCache(cacheKey: string): Promise<unknown | null> {
  const hit = await SeoProviderCache.findOne({ cacheKey }).lean<{ payload?: unknown }>();
  return hit?.payload ?? null;
}

async function writeCache(cacheKey: string, kind: 'keyword' | 'serp', payload: unknown): Promise<void> {
  await SeoProviderCache.updateOne(
    { cacheKey },
    { $set: { kind, payload, fetchedAt: new Date() } },
    { upsert: true }
  );
}

async function refreshCampaign(campaignId: Types.ObjectId): Promise<void> {
  const drafts = await SeoDraft.find({ campaignId }).select('status');
  const waiting = new Set(['queued', 'researching', 'serp', 'generating', 'validating']);
  const status = drafts.some((row) => waiting.has(row.status)) ? 'running' : 'ready';
  await SeoCampaign.updateOne({ _id: campaignId }, { $set: { status } });
}

const RUNNING = new Set(['queued', 'researching', 'serp', 'generating', 'validating']);

/** One draft per campaign may run. A finished holder is replaced; a live holder makes the caller wait. */
export async function claimCampaignTurn(draftId: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(draftId)) return true;
  const draft = await SeoDraft.findById(draftId).select('campaignId status');
  if (!draft) return true;
  if (!RUNNING.has(draft.status)) {
    await releaseCampaignTurn(draft.campaignId, draft._id);
    return true;
  }
  const owned = await SeoCampaign.findOneAndUpdate(
    {
      _id: draft.campaignId,
      $or: [{ activeDraftId: null }, { activeDraftId: draft._id }],
    },
    { $set: { activeDraftId: draft._id } }
  );
  if (owned) return true;
  const holder = await SeoCampaign.findById(draft.campaignId).select('activeDraftId');
  if (!holder?.activeDraftId) return false;
  const other = await SeoDraft.findById(holder.activeDraftId).select('status');
  if (other && RUNNING.has(other.status)) return false;
  const stole = await SeoCampaign.findOneAndUpdate(
    { _id: draft.campaignId, activeDraftId: holder.activeDraftId },
    { $set: { activeDraftId: draft._id } }
  );
  return Boolean(stole);
}

/** Clears this draft's turn and starts the next tool that has not been researched yet. */
export async function releaseCampaignTurn(campaignId: Types.ObjectId, draftId: Types.ObjectId): Promise<void> {
  const released = await SeoCampaign.findOneAndUpdate(
    { _id: campaignId, activeDraftId: draftId },
    { $set: { activeDraftId: null } }
  );
  if (!released) return;
  const running = await SeoDraft.exists({
    campaignId,
    status: { $in: ['researching', 'serp', 'generating', 'validating'] },
  });
  if (running) return;
  const next = await SeoDraft.findOne({
    campaignId,
    status: 'queued',
    completedSteps: { $size: 0 },
  }).sort({ _id: 1 });
  if (!next) return;
  const reserved = await SeoCampaign.findOneAndUpdate(
    { _id: campaignId, activeDraftId: null },
    { $set: { activeDraftId: next._id } }
  );
  if (!reserved) return;
  await enqueueSeoStep('seo-inventory', String(next._id));
}

export async function markSeoDraftFailed(draftId: string, step: string, message: string): Promise<void> {
  if (!Types.ObjectId.isValid(draftId)) return;
  await SeoDraft.updateOne(
    { _id: draftId, status: { $nin: ['published', 'approved', 'needs_review'] } },
    { $set: { status: 'failed', failedStep: step, error: message.slice(0, 500) } }
  );
  const draft = await SeoDraft.findById(draftId).select('campaignId');
  if (draft) await refreshCampaign(draft.campaignId);
  if (draft) await releaseCampaignTurn(draft.campaignId, draft._id);
}
