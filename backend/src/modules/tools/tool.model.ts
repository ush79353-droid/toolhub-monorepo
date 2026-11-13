import mongoose, { Schema, type Document, type Model, type Types } from 'mongoose';
import type { ToolExecutionType } from '../../types/tool';

export interface ITool extends Document {
  name: string;
  nameKey: string;
  slug: string;
  category: Types.ObjectId;
  pillar: Types.ObjectId | null;
  subPillar: Types.ObjectId | null;
  iconMedia: Types.ObjectId | null;
  iconUrl: string;
  executionType: ToolExecutionType;
  componentKey: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  ogImageAlt: string;
  ogType: string;
  ogSiteName: string;
  keywords: string;
  indexable: boolean;
  robotsFollow: boolean;
  robotsNoArchive: boolean;
  robotsNoSnippet: boolean;
  robotsNoImageIndex: boolean;
  robotsMaxSnippet: number | null;
  robotsMaxImagePreview: string;
  robotsMaxVideoPreview: number | null;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageUrl: string;
  twitterImageAlt: string;
  twitterSite: string;
  schemaType: string;
  includeFaqSchema: boolean;
  sitemapInclude: boolean;
  sitemapPriority: number | null;
  sitemapChangeFrequency: string;
  /** When false, `/embed/[slug]` refuses to render. Default true; only explicit admin OFF disables. */
  embedEnabled: boolean;
  embedDefaultHeight: number;
  embedPreferredLayout: string;
  /** Comma-separated hostnames for advisory allowlisting (not a signed auth system). */
  embedAllowedDomains: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const toolSchema = new Schema<ITool>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    nameKey: { type: String, required: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    pillar: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    subPillar: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    iconMedia: { type: Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
    iconUrl: { type: String, default: '' },
    executionType: {
      type: String,
      enum: ['client', 'server', 'third-party'],
      default: 'client',
    },
    componentKey: { type: String, trim: true, maxlength: 100, default: '' },
    shortDescription: { type: String, default: '', maxlength: 500 },
    metaTitle: { type: String, default: '', maxlength: 70 },
    metaDescription: { type: String, default: '', maxlength: 160 },
    canonicalUrl: { type: String, default: '', maxlength: 300 },
    ogTitle: { type: String, default: '', maxlength: 70 },
    ogDescription: { type: String, default: '', maxlength: 200 },
    ogImageUrl: { type: String, default: '', maxlength: 500 },
    ogImageAlt: { type: String, default: '', maxlength: 200 },
    ogType: { type: String, default: '', maxlength: 40 },
    ogSiteName: { type: String, default: '', maxlength: 80 },
    keywords: { type: String, default: '', maxlength: 200 },
    indexable: { type: Boolean, default: true },
    robotsFollow: { type: Boolean, default: true },
    robotsNoArchive: { type: Boolean, default: false },
    robotsNoSnippet: { type: Boolean, default: false },
    robotsNoImageIndex: { type: Boolean, default: false },
    robotsMaxSnippet: { type: Number, default: null },
    robotsMaxImagePreview: { type: String, default: '', maxlength: 20 },
    robotsMaxVideoPreview: { type: Number, default: null },
    twitterCard: { type: String, default: '', maxlength: 40 },
    twitterTitle: { type: String, default: '', maxlength: 70 },
    twitterDescription: { type: String, default: '', maxlength: 200 },
    twitterImageUrl: { type: String, default: '', maxlength: 500 },
    twitterImageAlt: { type: String, default: '', maxlength: 200 },
    twitterSite: { type: String, default: '', maxlength: 40 },
    schemaType: { type: String, default: '', maxlength: 40 },
    includeFaqSchema: { type: Boolean, default: false },
    sitemapInclude: { type: Boolean, default: true },
    sitemapPriority: { type: Number, default: null },
    sitemapChangeFrequency: { type: String, default: '', maxlength: 20 },
    embedEnabled: { type: Boolean, default: true },
    embedDefaultHeight: { type: Number, default: 650, min: 320, max: 4000 },
    embedPreferredLayout: { type: String, default: 'responsive', maxlength: 20 },
    embedAllowedDomains: { type: String, default: '', maxlength: 1000 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

toolSchema.index({ nameKey: 1 }, { unique: true });
toolSchema.index({ slug: 1 }, { unique: true });
toolSchema.index({ category: 1, updatedAt: -1 });

export const Tool: Model<ITool> = mongoose.models.Tool || mongoose.model<ITool>('Tool', toolSchema);
