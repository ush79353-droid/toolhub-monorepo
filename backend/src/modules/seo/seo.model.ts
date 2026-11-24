import mongoose, { Schema, type Document, type Model, type Types } from 'mongoose';
import type { KeywordFact, SuggestedLink } from './choose-keyword';
import type { SeoContent } from './content';
import type { DraftValidation } from './validate-draft';

export type SeoCampaignStatus = 'running' | 'ready';

export type SeoDraftStatus =
  | 'queued'
  | 'researching'
  | 'serp'
  | 'generating'
  | 'validating'
  | 'needs_review'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'failed';

export interface SeoSnapshot {
  name: string;
  slug: string;
  pillarName: string;
  shortDescription: string;
  componentKey: string;
  categorySlug: string;
}

export interface SerpItem {
  title: string;
  url: string;
  position: number;
}

export interface SeoCallCounts {
  keyword: number;
  serp: number;
  openai: number;
}

export interface ISeoCampaign extends Document {
  name: string;
  categoryId: Types.ObjectId;
  maxTools: number;
  status: SeoCampaignStatus;
  locationCode: number;
  languageCode: string;
  createdBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISeoDraft extends Document {
  campaignId: Types.ObjectId;
  toolId: Types.ObjectId;
  status: SeoDraftStatus;
  snapshot: SeoSnapshot;
  keywordFacts: KeywordFact[];
  keywordPayload: unknown;
  primaryKeyword: string;
  secondaryKeywords: string[];
  serpItems: SerpItem[];
  serpPayload: unknown;
  suggestedLinks: SuggestedLink[];
  content: SeoContent | null;
  validation: DraftValidation;
  completedSteps: string[];
  callCounts: SeoCallCounts;
  error: string;
  failedStep: string;
  reviewerId: Types.ObjectId | null;
  reviewedAt: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISeoProviderCache extends Document {
  cacheKey: string;
  kind: 'keyword' | 'serp';
  payload: unknown;
  fetchedAt: Date;
}

const campaignSchema = new Schema<ISeoCampaign>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    maxTools: { type: Number, required: true, min: 1, max: 20 },
    status: { type: String, enum: ['running', 'ready'], default: 'running' },
    locationCode: { type: Number, required: true },
    languageCode: { type: String, required: true, maxlength: 8 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  },
  { timestamps: true }
);

const keywordFactSchema = new Schema<KeywordFact>(
  {
    keyword: { type: String, required: true },
    searchVolume: { type: Number, default: null },
    difficulty: { type: Number, default: null },
    cpc: { type: Number, default: null },
  },
  { _id: false }
);

const serpItemSchema = new Schema<SerpItem>(
  {
    title: { type: String, default: '' },
    url: { type: String, default: '' },
    position: { type: Number, required: true },
  },
  { _id: false }
);

const suggestedLinkSchema = new Schema<SuggestedLink>(
  {
    toolId: { type: String, required: true },
    slug: { type: String, required: true },
    anchor: { type: String, required: true },
  },
  { _id: false }
);

const draftSchema = new Schema<ISeoDraft>(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'SeoCampaign', required: true, index: true },
    toolId: { type: Schema.Types.ObjectId, ref: 'Tool', required: true, index: true },
    status: {
      type: String,
      enum: [
        'queued',
        'researching',
        'serp',
        'generating',
        'validating',
        'needs_review',
        'approved',
        'published',
        'rejected',
        'failed',
      ],
      default: 'queued',
      index: true,
    },
    snapshot: {
      name: { type: String, default: '' },
      slug: { type: String, default: '' },
      pillarName: { type: String, default: '' },
      shortDescription: { type: String, default: '' },
      componentKey: { type: String, default: '' },
      categorySlug: { type: String, default: '' },
    },
    keywordFacts: { type: [keywordFactSchema], default: [] },
    keywordPayload: { type: Schema.Types.Mixed, default: null },
    primaryKeyword: { type: String, default: '' },
    secondaryKeywords: { type: [String], default: [] },
    serpItems: { type: [serpItemSchema], default: [] },
    serpPayload: { type: Schema.Types.Mixed, default: null },
    suggestedLinks: { type: [suggestedLinkSchema], default: [] },
    content: { type: Schema.Types.Mixed, default: null },
    validation: {
      ok: { type: Boolean, default: false },
      issues: {
        type: [
          new Schema(
            {
              code: { type: String, required: true },
              message: { type: String, required: true },
              severity: { type: String, enum: ['block', 'flag'], required: true },
            },
            { _id: false }
          ),
        ],
        default: [],
      },
    },
    completedSteps: { type: [String], default: [] },
    callCounts: {
      keyword: { type: Number, default: 0 },
      serp: { type: Number, default: 0 },
      openai: { type: Number, default: 0 },
    },
    error: { type: String, default: '', maxlength: 500 },
    failedStep: { type: String, default: '' },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
    reviewedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

draftSchema.index({ campaignId: 1, toolId: 1 }, { unique: true });
draftSchema.index({ toolId: 1, status: 1 });

const cacheSchema = new Schema<ISeoProviderCache>(
  {
    cacheKey: { type: String, required: true, unique: true },
    kind: { type: String, enum: ['keyword', 'serp'], required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    fetchedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const SeoCampaign: Model<ISeoCampaign> =
  mongoose.models.SeoCampaign || mongoose.model<ISeoCampaign>('SeoCampaign', campaignSchema);

export const SeoDraft: Model<ISeoDraft> =
  mongoose.models.SeoDraft || mongoose.model<ISeoDraft>('SeoDraft', draftSchema);

export const SeoProviderCache: Model<ISeoProviderCache> =
  mongoose.models.SeoProviderCache ||
  mongoose.model<ISeoProviderCache>('SeoProviderCache', cacheSchema, 'seo_provider_cache');
