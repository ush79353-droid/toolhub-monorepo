import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ICurrencyRate extends Document {
  baseCurrency: string;
  fullName: string;
  symbol: string;
  conversionRates: Map<string, number>;
  fetchedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const currencyRateSchema = new Schema<ICurrencyRate>(
  {
    baseCurrency: { type: String, required: true, unique: true, trim: true, uppercase: true },
    fullName: { type: String, required: true, trim: true },
    symbol: { type: String, required: true, trim: true },
    conversionRates: { type: Map, of: Number, required: true },
    fetchedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CurrencyRate: Model<ICurrencyRate> =
  mongoose.models.CurrencyRate || mongoose.model<ICurrencyRate>('CurrencyRate', currencyRateSchema);
