import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IMediaAsset extends Document {
  fileName: string;
  contentType: string;
  size: number;
  width?: number;
  height?: number;
  altText: string;
  key: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMediaAsset>(
  {
    fileName: { type: String, required: true, trim: true, maxlength: 180 },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    altText: { type: String, default: '', maxlength: 300 },
    key: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

mediaSchema.index({ key: 1 }, { unique: true });
mediaSchema.index({ createdAt: -1 });

export const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset || mongoose.model<IMediaAsset>('MediaAsset', mediaSchema);
