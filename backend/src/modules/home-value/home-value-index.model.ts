import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IHomeValueIndexObservation {
  period: string;
  value: number;
}

export interface IHomeValueIndexCache extends Document {
  seriesKey: string;
  fredSeriesId: string;
  label: string;
  source: string;
  frequency: 'monthly';
  observations: IHomeValueIndexObservation[];
  firstPeriod: string;
  latestPeriod: string;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const observationSchema = new Schema<IHomeValueIndexObservation>(
  {
    period: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { _id: false }
);

const homeValueIndexCacheSchema = new Schema<IHomeValueIndexCache>(
  {
    seriesKey: { type: String, required: true, unique: true, trim: true },
    fredSeriesId: { type: String, required: true, trim: true, uppercase: true },
    label: { type: String, required: true, trim: true },
    source: { type: String, required: true, trim: true },
    frequency: { type: String, required: true, enum: ['monthly'], default: 'monthly' },
    observations: { type: [observationSchema], required: true },
    firstPeriod: { type: String, required: true },
    latestPeriod: { type: String, required: true },
    fetchedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

homeValueIndexCacheSchema.index({ fredSeriesId: 1 });

export const HomeValueIndexCache: Model<IHomeValueIndexCache> =
  mongoose.models.HomeValueIndexCache ||
  mongoose.model<IHomeValueIndexCache>(
    'HomeValueIndexCache',
    homeValueIndexCacheSchema
  );
