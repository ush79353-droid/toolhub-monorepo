'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { BusinessLoanForm } from './BusinessLoanForm';
import { BusinessLoanResults } from './BusinessLoanResults';
import { calculateBusinessLoan } from './calculation';
import type {
  BusinessLoanFieldErrors,
  BusinessLoanInput,
  BusinessLoanResult,
} from './types';
import { validateBusinessLoanInput } from './validation';

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

export function BusinessLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<BusinessLoanInput>(DEFAULT_INPUT);
  const [errors, setErrors] = React.useState<BusinessLoanFieldErrors>({});
  const [result, setResult] = React.useState<BusinessLoanResult | null>(() => {
    const val = validateBusinessLoanInput(DEFAULT_INPUT);
    return val.isValid && val.parsedValues ? calculateBusinessLoan(val.parsedValues) : null;
  });
  const [copied, setCopied] = React.useState(false);

  const handleInputChange = (field: keyof BusinessLoanInput, value: unknown) => {
    const nextInput = { ...input, [field]: value };
    setInput(nextInput);

    const validation = validateBusinessLoanInput(nextInput);
    setErrors(validation.errors);

    if (validation.isValid && validation.parsedValues) {
      setResult(calculateBusinessLoan(validation.parsedValues));
    } else {
      setResult(null);
    }
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setErrors({});
    const val = validateBusinessLoanInput(DEFAULT_INPUT);
    setResult(val.isValid && val.parsedValues ? calculateBusinessLoan(val.parsedValues) : null);
  };

  const handleShare = async () => {
    if (!result) return;
    const money = (v: number) => formatCurrencyValue(v, result.currency);
    const summary = [
      `${metadata.title} — Omega Calculators`,
      `Loan amount: ${money(Number(input.loanAmount))}`,
      `Interest rate: ${input.interestRate}% (${input.knownRate})`,
      `Term: ${input.termYears} yrs ${input.termMonths} mos`,
      `Payment frequency: ${input.paymentFrequency}`,
      `Periodic payment: ${money(result.periodicPayment)}`,
      `Net loan received: ${money(result.netLoanReceived)}`,
      `Total interest: ${money(result.totalInterest)}`,
      `Total finance charge: ${money(result.totalFinanceCharge)}`,
      `APR: ${result.apr.toFixed(2)}% (Effective APR: ${result.effectiveApr.toFixed(2)}%)`,
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
            Commercial loan payment, total interest, finance charges, and APR analysis
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="p-4 sm:p-5">
        <BusinessLoanForm input={input} errors={errors} onChange={handleInputChange} />
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
