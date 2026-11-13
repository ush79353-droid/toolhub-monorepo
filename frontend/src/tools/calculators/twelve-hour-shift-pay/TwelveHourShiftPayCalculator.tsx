'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { calculateTwelveHourShiftPay } from './calculation';
import {
  DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT,
  type TwelveHourShiftPayFieldErrors,
  type TwelveHourShiftPayResult,
} from './types';
import { validateTwelveHourShiftPay } from './validation';
import {
  draftToInput,
  inputToDraft,
  TwelveHourShiftPayForm,
  type TwelveHourShiftPayDraft,
} from './TwelveHourShiftPayForm';
import { formatShiftPay, TwelveHourShiftPayResults } from './TwelveHourShiftPayResults';

function summaryText(result: TwelveHourShiftPayResult): string {
  const money = (value: number) => formatShiftPay(value, result.currency);
  return [
    '12-Hour Shift Pay Calculator — Omega Calculators',
    `Pay per shift: ${money(result.shiftPay)}`,
    `Average hourly: ${money(result.averageHourlyPay)}`,
    `Regular pay: ${money(result.regularPay)} (${result.regularHours} h)`,
    `Overtime pay: ${money(result.overtimePay)} (${result.overtimeHours} h)`,
    `Weekly: ${money(result.weeklyPay)}`,
    `Monthly: ${money(result.monthlyPay)}`,
    `Yearly: ${money(result.yearlyPay)}`,
    `Assumes ${result.shiftsPerWeek} shifts/week and ${result.weeksPerYear} weeks/year.`,
    result.overtimeWageSource === 'suggested'
      ? 'Overtime wage is the 1.5× suggestion.'
      : 'Overtime wage was entered directly.',
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function TwelveHourShiftPayCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<TwelveHourShiftPayDraft>(() =>
    inputToDraft(DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT)
  );
  const [errors, setErrors] = React.useState<TwelveHourShiftPayFieldErrors>({});
  const [result, setResult] = React.useState<TwelveHourShiftPayResult | null>(() =>
    calculateTwelveHourShiftPay(DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT)
  );
  const [copied, setCopied] = React.useState(false);

  const evaluate = React.useCallback((next: TwelveHourShiftPayDraft) => {
    const parsed = draftToInput(next);
    const validation = validateTwelveHourShiftPay(parsed);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateTwelveHourShiftPay(parsed) : null);
  }, []);

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
          <p className="text-xs font-normal text-muted-foreground">Formatting currency only</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="shift-pay-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="shift-pay-currency"
              aria-label="Display currency"
              value={draft.currency}
              onChange={(currency) => {
                const next = { ...draft, currency };
                setDraft(next);
                evaluate(next);
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <TwelveHourShiftPayForm
          draft={draft}
          errors={errors}
          onDraftChange={(next) => {
            setDraft(next);
            evaluate(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            const fresh = inputToDraft(DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT);
            setDraft(fresh);
            setErrors({});
            setResult(calculateTwelveHourShiftPay(DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT));
            setCopied(false);
          }}
        />
        <TwelveHourShiftPayResults
          result={result}
          copied={copied}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(result)).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
        />
      </div>
    </section>
  );
}
