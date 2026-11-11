import mongoose, { Schema, type Document, type Model, type Types } from 'mongoose';

export interface ITool extends Document {
  name: string;
  nameKey: string;
  slug: string;
  category: Types.ObjectId;
  pillar: Types.ObjectId;
  subPillar: Types.ObjectId | null;
  iconMedia: Types.ObjectId | null;
  iconUrl: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
  indexable: boolean;
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
    pillar: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subPillar: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    iconMedia: { type: Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
    iconUrl: { type: String, default: '' },
    shortDescription: { type: String, default: '', maxlength: 500 },
    metaTitle: { type: String, default: '', maxlength: 70 },
    metaDescription: { type: String, default: '', maxlength: 160 },
    canonicalUrl: { type: String, default: '', maxlength: 300 },
    ogTitle: { type: String, default: '', maxlength: 70 },
    ogDescription: { type: String, default: '', maxlength: 200 },
    keywords: { type: String, default: '', maxlength: 200 },
    indexable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

toolSchema.index({ nameKey: 1 }, { unique: true });
toolSchema.index({ slug: 1 }, { unique: true });
toolSchema.index({ category: 1, updatedAt: -1 });

export const Tool: Model<ITool> = mongoose.models.Tool || mongoose.model<ITool>('Tool', toolSchema);
