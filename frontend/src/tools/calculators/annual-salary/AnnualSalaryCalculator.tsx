'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { useCurrencyRatesStatus } from '@/tools/shared/CurrencyRatesProvider';
import { AnnualSalaryForm } from './AnnualSalaryForm';
import {
  createDefaultInput,
  type AnnualSalaryFieldErrors,
  type AnnualSalaryInput,
  type AnnualSalaryResult,
} from './types';

const FX_NOTE =
  'Hourly wage, annual salary, net hourly, and net annual each have their own currency. Salary math runs in the hourly-wage currency; results convert for display. Hours, weeks, and the flat tax percent are never converted. Missing rates block conversion; stale rates warn but still convert.';

function inputsEqual(a: AnnualSalaryInput, b: AnnualSalaryInput): boolean {
  return (
    a.hoursPerWeek === b.hoursPerWeek &&
    a.weeksPerYear === b.weeksPerYear &&
    a.hourlyWage === b.hourlyWage &&
    a.hourlyWageCurrency === b.hourlyWageCurrency &&
    a.annualSalaryCurrency === b.annualSalaryCurrency &&
    a.taxPercent === b.taxPercent &&
    a.netHourlyCurrency === b.netHourlyCurrency &&
    a.netAnnualCurrency === b.netAnnualCurrency &&
    a.netOpen === b.netOpen
  );
}

/**
 * UI shell for Annual Salary Calculator (fields, share/reload/clear/feedback).
 * Calculation and Phase 2 FX conversion wire in a follow-up commit.
 */
export function AnnualSalaryCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<AnnualSalaryInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<AnnualSalaryInput>(() => defaults);
  const [errors, setErrors] = React.useState<AnnualSalaryFieldErrors>({});
  const [result, setResult] = React.useState<AnnualSalaryResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [conversionError, setConversionError] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: AnnualSalaryInput) => {
    setConversionError(null);
    setInput(next);
    setErrors({});
    setResult(null);
  };

  const handleHourlyWageCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.hourlyWageCurrency) return;
    apply({ ...input, hourlyWageCurrency: next });
  };

  const handleAnnualSalaryCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.annualSalaryCurrency) return;
    apply({ ...input, annualSalaryCurrency: next });
  };

  const handleNetHourlyCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.netHourlyCurrency) return;
    apply({ ...input, netHourlyCurrency: next });
  };

  const handleNetAnnualCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.netAnnualCurrency) return;
    apply({ ...input, netAnnualCurrency: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
    setConversionError(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const currencyNote = ratesStatus.available
    ? FX_NOTE
    : 'Currency conversion rates are unavailable. Money fields stay in their selected currency labels until rates load.';
  const wageSymbol = getCurrencySymbol(input.hourlyWageCurrency);
  const annualSymbol = getCurrencySymbol(
    result?.annualSalaryCurrency ?? input.annualSalaryCurrency
  );
  const netHourlySymbol = getCurrencySymbol(
    result?.netHourlyCurrency ?? input.netHourlyCurrency
  );
  const netAnnualSymbol = getCurrencySymbol(
    result?.netAnnualCurrency ?? input.netAnnualCurrency
  );
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Hours/week: ${input.hoursPerWeek}`,
        `Weeks/year: ${input.weeksPerYear}`,
        `Hourly wage: ${wageSymbol}${input.hourlyWage} ${input.hourlyWageCurrency}`,
        `Annual salary: ${annualSymbol}${result.formattedAnnualSalary} ${result.annualSalaryCurrency}`,
        `Flat tax: ${input.taxPercent}% (simplified estimate — not jurisdiction-specific)`,
        `Net hourly: ${netHourlySymbol}${result.formattedNetHourly} ${result.netHourlyCurrency}`,
        `Net annual: ${netAnnualSymbol}${result.formattedNetAnnual} ${result.netAnnualCurrency}`,
        `Formulas: Annual = Hourly × Hours × Weeks; Net Hourly = Hourly × (1−Tax/100); Net Annual = Annual × (1−Tax/100)`,
        currencyNote,
      ].join('\n')
    : '';

  const handleShare = async () => {
    if (!summary) return;
    if (canShare) {
      try {
        await navigator.share({ title: metadata.title, text: summary });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through
      }
    }
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
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            {currencyNote}
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <AnnualSalaryForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onHourlyWageCurrencyChange={handleHourlyWageCurrencyChange}
          onAnnualSalaryCurrencyChange={handleAnnualSalaryCurrencyChange}
          onNetHourlyCurrencyChange={handleNetHourlyCurrencyChange}
          onNetAnnualCurrencyChange={handleNetAnnualCurrencyChange}
          conversionError={conversionError}
          ratesWarning={ratesStatus.warning}
        />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={handleReset}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty}
              onClick={handleReset}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'yes'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              <span>No</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
