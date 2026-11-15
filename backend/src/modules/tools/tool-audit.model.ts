import mongoose, { Schema, type Model } from 'mongoose';

const statSchema = new Schema(
  {
    category: { type: String, required: true },
    total: { type: Number, required: true },
    developed: { type: Number, required: true },
    pending: { type: Number, required: true },
    needsReview: { type: Number, required: true },
  },
  { _id: false }
);

const duplicateSchema = new Schema(
  {
    value: { type: String, required: true },
    count: { type: Number, required: true },
    slugs: { type: [String], default: [] },
  },
  { _id: false }
);

const sharedSchema = new Schema(
  {
    component: { type: String, required: true },
    count: { type: Number, required: true },
    slugs: { type: [String], default: [] },
  },
  { _id: false }
);

export interface IToolAudit {
  kind: 'latest' | 'run';
  ranAt: Date;
  source: 'filesystem' | 'manifest';
  warning: string;
  total: number;
  developed: number;
  notDeveloped: number;
  needsReview: number;
  completionPercent: number;
  updatedCount: number;
  newlyDeveloped: string[];
  regressed: string[];
  categoryStats: Array<{
    category: string;
    total: number;
    developed: number;
    pending: number;
    needsReview: number;
  }>;
  duplicates: {
    ids: Array<{ value: string; count: number; slugs: string[] }>;
    slugs: Array<{ value: string; count: number; slugs: string[] }>;
    routes: Array<{ value: string; count: number; slugs: string[] }>;
    sharedComponents: Array<{ component: string; count: number; slugs: string[] }>;
  };
  rows?: unknown;
}

const toolAuditSchema = new Schema<IToolAudit>(
  {
    kind: { type: String, enum: ['latest', 'run'], required: true },
    ranAt: { type: Date, required: true },
    source: { type: String, enum: ['filesystem', 'manifest'], required: true },
    warning: { type: String, default: '' },
    total: { type: Number, required: true },
    developed: { type: Number, required: true },
    notDeveloped: { type: Number, required: true },
    needsReview: { type: Number, required: true },
    completionPercent: { type: Number, required: true },
    updatedCount: { type: Number, required: true, default: 0 },
    newlyDeveloped: { type: [String], default: [] },
    regressed: { type: [String], default: [] },
    categoryStats: { type: [statSchema], default: [] },
    duplicates: {
      ids: { type: [duplicateSchema], default: [] },
      slugs: { type: [duplicateSchema], default: [] },
      routes: { type: [duplicateSchema], default: [] },
      sharedComponents: { type: [sharedSchema], default: [] },
    },
    rows: { type: Schema.Types.Mixed, default: undefined },
  },
  { timestamps: true }
);

toolAuditSchema.index({ kind: 1, ranAt: -1 });

export const ToolAudit: Model<IToolAudit> =
  mongoose.models.ToolAudit || mongoose.model<IToolAudit>('ToolAudit', toolAuditSchema);
