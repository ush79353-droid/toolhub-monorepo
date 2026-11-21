import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { VatMode, VatResult } from './types';

/** Round once at the money boundary (half-up via Math.round). */
export function roundMoneyAmount(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatVatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatVatRate(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(rate);
}

/** Add VAT to a net price. Supports 0% VAT. Rate must be > -100. */
export function addVat(
  netPrice: number,
  vatRatePercent: number,
): { netPrice: number; vatAmount: number; grossPrice: number } | null {
  if (![netPrice, vatRatePercent].every(Number.isFinite)) return null;
  if (netPrice < 0) return null;
  if (!(vatRatePercent > -100)) return null;
  const vatAmount = netPrice * (vatRatePercent / 100);
  const grossPrice = netPrice + vatAmount;
  if (![vatAmount, grossPrice].every(Number.isFinite)) return null;
  return { netPrice, vatAmount, grossPrice };
}

/**
 * Remove included VAT from a gross price (reverse VAT).
 * Net = Gross / (1 + rate/100) — never Gross × (1 − rate/100).
 */
export function removeVat(
  grossPrice: number,
  vatRatePercent: number,
): { netPrice: number; vatAmount: number; grossPrice: number } | null {
  if (![grossPrice, vatRatePercent].every(Number.isFinite)) return null;
  if (grossPrice < 0) return null;
  if (!(vatRatePercent > -100)) return null;
  const denom = 1 + vatRatePercent / 100;
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const netPrice = grossPrice / denom;
  const vatAmount = grossPrice - netPrice;
  if (![netPrice, vatAmount].every(Number.isFinite)) return null;
  return { netPrice, vatAmount, grossPrice };
}

export function calculateVatFromNet(
  netPrice: number,
  vatRatePercent: number,
  currency: SupportedCurrency,
  mode: VatMode = 'excluded',
): VatResult | null {
  const raw = addVat(netPrice, vatRatePercent);
  if (!raw) return null;
  const net = roundMoneyAmount(raw.netPrice, currency);
  const gross = roundMoneyAmount(raw.grossPrice, currency);
  const vatAmount = roundMoneyAmount(gross - net, currency);
  return {
    mode,
    vatRate: vatRatePercent,
    netPrice: net,
    vatAmount,
    grossPrice: gross,
    currency,
    formattedVatRate: formatVatRate(vatRatePercent),
    formattedNetPrice: formatVatMoney(net, currency),
    formattedVatAmount: formatVatMoney(vatAmount, currency),
    formattedGrossPrice: formatVatMoney(gross, currency),
  };
}

export function calculateVatFromGross(
  grossPrice: number,
  vatRatePercent: number,
  currency: SupportedCurrency,
  mode: VatMode = 'included',
): VatResult | null {
  const raw = removeVat(grossPrice, vatRatePercent);
  if (!raw) return null;
  const gross = roundMoneyAmount(raw.grossPrice, currency);
  const net = roundMoneyAmount(raw.netPrice, currency);
  const vatAmount = roundMoneyAmount(gross - net, currency);
  return {
    mode,
    vatRate: vatRatePercent,
    netPrice: net,
    vatAmount,
    grossPrice: gross,
    currency,
    formattedVatRate: formatVatRate(vatRatePercent),
    formattedNetPrice: formatVatMoney(net, currency),
    formattedVatAmount: formatVatMoney(vatAmount, currency),
    formattedGrossPrice: formatVatMoney(gross, currency),
  };
}

export function shareResultText(
  result: VatResult,
  path = '/tools/vat-calculator',
): string {
  return [
    'VAT Calculator | Omega Calculators',
    '',
    `Mode: ${result.mode === 'excluded' ? 'VAT excluded (add VAT)' : 'VAT included (remove VAT)'}`,
    `VAT rate: ${result.formattedVatRate}%`,
    `Net price: ${result.formattedNetPrice} ${result.currency}`,
    `VAT amount: ${result.formattedVatAmount} ${result.currency}`,
    `Gross price: ${result.formattedGrossPrice} ${result.currency}`,
    '',
    'Currency changes the display symbol only; amounts are not converted.',
    path,
  ].join('\n');
}
