import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ICurrencyRateHistory extends Document {
  baseCurrency: string;
  conversionRates: Map<string, number>;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const currencyRateHistorySchema = new Schema<ICurrencyRateHistory>(
  {
    baseCurrency: { type: String, required: true, trim: true, uppercase: true },
    conversionRates: { type: Map, of: Number, required: true },
    fetchedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

currencyRateHistorySchema.index({ baseCurrency: 1, fetchedAt: -1 });

export const CurrencyRateHistory: Model<ICurrencyRateHistory> =
  mongoose.models.CurrencyRateHistory ||
  mongoose.model<ICurrencyRateHistory>('CurrencyRateHistory', currencyRateHistorySchema);
