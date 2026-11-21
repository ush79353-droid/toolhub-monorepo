import {
  getProvinceConfig,
  type ProvinceCode,
  type TaxLineSpec,
} from './rates';

/** CAD money display — round half-up to cents for presentation only. */
export function formatCadMoney(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatRatePercent(rate: number): string {
  const pct = rate * 100;
  // QST 9.975 keeps three decimals; others typically whole/one decimal.
  const digits = Number.isInteger(pct) ? 0 : pct * 10 === Math.round(pct * 10) ? 1 : 3;
  return `${pct.toFixed(digits)}%`;
}

export function lineLabelWithRate(line: TaxLineSpec): string {
  return `${line.label} (${formatRatePercent(line.rate)})`;
}

/**
 * General taxable-purchase estimate for the selected province/territory.
 * GST+PST/RST/QST: each provincial tax is on the pre-tax amount (not tax-on-tax).
 * HST: single combined rate — do not add GST again.
 */
export function calculateCanadaGstQst(input: {
  province: ProvinceCode;
  amountBeforeTax: number;
}): {
  province: ProvinceCode;
  provinceName: string;
  blurb: string;
  amountBeforeTax: number;
  lines: { key: string; label: string; rate: number; amount: number }[];
  totalTax: number;
  amountAfterTax: number;
} | null {
  const { province, amountBeforeTax } = input;
  if (!Number.isFinite(amountBeforeTax) || amountBeforeTax < 0) return null;

  const config = getProvinceConfig(province);
  const lines = config.lines.map((line) => ({
    key: line.key,
    label: line.label,
    rate: line.rate,
    amount: amountBeforeTax * line.rate,
  }));

  const totalTax = lines.reduce((sum, line) => sum + line.amount, 0);
  const amountAfterTax = amountBeforeTax + totalTax;

  if (
    ![amountBeforeTax, totalTax, amountAfterTax, ...lines.map((l) => l.amount)].every(
      Number.isFinite
    )
  ) {
    return null;
  }

  return {
    province,
    provinceName: config.name,
    blurb: config.blurb,
    amountBeforeTax,
    lines,
    totalTax,
    amountAfterTax,
  };
}
