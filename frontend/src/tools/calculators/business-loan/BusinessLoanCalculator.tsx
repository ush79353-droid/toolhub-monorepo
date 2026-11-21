'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { BusinessLoanForm } from './BusinessLoanForm';
import { BusinessLoanResults } from './BusinessLoanResults';
import { calculateBusinessLoan } from './calculation';
import type {
  BusinessLoanFieldErrors,
  BusinessLoanInput,
  BusinessLoanResult,
} from './types';
import { validateBusinessLoanInput } from './validation';

const MONEY_FIELDS = ['loanAmount', 'prepaidFee', 'loanedFee'] as const;

const DEFAULT_INPUT: BusinessLoanInput = {
  knownRate: 'nominal',
  interestRate: '5',
  compoundFrequency: 'monthly',
  loanAmount: '100000',
  termYears: '10',
  termMonths: '0',
  paymentFrequency: 'monthly',
  prepaidFee: '500',
  loanedFee: '1000',
  originationFee: '8',
  originationFeeRepayment: 'from_loan',
  currency: 'PKR',
};

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts loan amount and fee cash amounts using stored exchange rates. Interest rate, term, and origination fee % stay the same.';

export function BusinessLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<BusinessLoanInput>(DEFAULT_INPUT);
  const [errors, setErrors] = React.useState<BusinessLoanFieldErrors>({});
  const [result, setResult] = React.useState<BusinessLoanResult | null>(() => {
    const val = validateBusinessLoanInput(DEFAULT_INPUT);
    return val.isValid && val.parsedValues ? calculateBusinessLoan(val.parsedValues) : null;
  });
  const [copied, setCopied] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const apply = (nextInput: BusinessLoanInput) => {
    setInput(nextInput);
    const validation = validateBusinessLoanInput(nextInput);
    setErrors(validation.errors);
    if (validation.isValid && validation.parsedValues) {
      setResult(calculateBusinessLoan(validation.parsedValues));
    } else {
      setResult(null);
    }
  };

  const handleInputChange = (field: keyof BusinessLoanInput, value: unknown) => {
    setConversionError(null);
    apply({ ...input, [field]: value });
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      input,
      MONEY_FIELDS,
      input.currency,
      currency,
      rates.rates
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    apply({
      ...input,
      ...converted.values,
      currency,
    });
  };

  const handleReset = () => {
    setErrors({});
    setConversionError(null);
    apply(DEFAULT_INPUT);
  };

  const handleShare = async () => {
    if (!result) return;
    const money = (v: number) => formatCurrencyValue(v, result.currency);
    const summary = [
      `${metadata.title} | Omega Calculators`,
      `Loan amount: ${money(Number(input.loanAmount))}`,
      `Interest rate: ${input.interestRate}% (${input.knownRate})`,
      `Term: ${input.termYears} yrs ${input.termMonths} mos`,
      `Payment frequency: ${input.paymentFrequency}`,
      `Periodic payment: ${money(result.periodicPayment)}`,
      `Net loan received: ${money(result.netLoanReceived)}`,
      `Total interest: ${money(result.totalInterest)}`,
      `Total finance charge: ${money(result.totalFinanceCharge)}`,
      `APR: ${result.apr.toFixed(2)}% (Effective APR: ${result.effectiveApr.toFixed(2)}%)`,
      currencyNote,
    ].join('\n');

    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Business Loan Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Commercial loan payment, total interest, finance charges, and APR analysis · {currencyNote}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        <BusinessLoanForm
          input={input}
          errors={errors}
          onChange={handleInputChange}
          onCurrencyChange={handleCurrencyChange}
        />
        <BusinessLoanResults
          result={result}
          copied={copied}
          onShare={handleShare}
          onReset={handleReset}
        />
      </div>
    </section>
  );
}