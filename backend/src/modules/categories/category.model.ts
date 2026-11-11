import mongoose, { Schema, type Document, type Model, type Types } from 'mongoose';

export type CategoryKind = 'category' | 'pillar' | 'sub_pillar';

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  kind: CategoryKind;
  parentId: string | null;
  sortOrder: number;
  description: string;
  isActive: boolean;
  children: CategoryNode[];
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  seedKey?: string;
  kind: CategoryKind;
  parent: Types.ObjectId | null;
  sortOrder: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    seedKey: { type: String, trim: true },
    kind: { type: String, required: true, enum: ['category', 'pillar', 'sub_pillar'] },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    sortOrder: { type: Number, required: true, default: 0 },
    description: { type: String, default: '', maxlength: 2000 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ seedKey: 1 }, { unique: true, sparse: true });
categorySchema.index({ parent: 1, sortOrder: 1 });

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
