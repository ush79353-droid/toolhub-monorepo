'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { PaydayLoanForm } from './PaydayLoanForm';
import {
  createDefaultInput,
  type PaydayLoanFieldErrors,
  type PaydayLoanInput,
  type PaydayLoanResult,
} from './types';
import { validatePaydayLoanInput } from './validation';

const CURRENCY_CONVERSION_NOTE =
  'Loan amount and finance charge convert on currency change. APR amount, monthly fee, and total debt currencies re-express calculated results. APR % and monthly fee % are never currency-converted.';

export function PaydayLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<PaydayLoanInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<PaydayLoanFieldErrors>({});
  const [result, setResult] = React.useState<PaydayLoanResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const apply = (next: PaydayLoanInput) => {
    const validation = validatePaydayLoanInput(next, rates);
    let merged = next;
    if (validation.result?.syncedAprPercent && next.editSource === 'financeCharge') {
      merged = { ...next, aprPercent: validation.result.syncedAprPercent };
    }
    if (validation.result?.syncedFinanceCharge && next.editSource === 'apr') {
      merged = { ...next, financeCharge: validation.result.syncedFinanceCharge };
    }
    setInput(merged);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
  };

  const loanSymbol = getCurrencySymbol(input.loanAmountCurrency);
  const chargeSymbol = getCurrencySymbol(input.financeChargeCurrency);
  const aprAmountSymbol = getCurrencySymbol(
    result?.aprAmountCurrency ?? input.aprAmountCurrency
  );
  const monthlyFeeSymbol = getCurrencySymbol(
    result?.monthlyFeeCurrency ?? input.monthlyFeeCurrency
  );
  const totalDebtSymbol = getCurrencySymbol(
    result?.totalDebtCurrency ?? input.totalDebtCurrency
  );

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Loan amount: ${loanSymbol}${input.loanAmount}`,
        `Finance charge: ${chargeSymbol}${input.financeCharge}`,
        `Loan term: ${result.loanTermDays} days`,
        `APR: ${result.formattedAprPercent}%`,
        `APR amount: ${aprAmountSymbol}${result.formattedAprAmount}`,
        `Monthly fee percent: ${result.monthlyFeePercent}%`,
        `Monthly fee: ${monthlyFeeSymbol}${result.formattedMonthlyFee}`,
        `Total debt: ${totalDebtSymbol}${result.formattedTotalDebt}`,
        currencyNote,
      ].join('\n')
    : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">{currencyNote}</p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <PaydayLoanForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onReset={handleReset}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
