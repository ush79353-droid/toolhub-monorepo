'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { BasisPointForm } from './BasisPointForm';
import { BasisPointResults } from './BasisPointResults';
import {
  createDefaultInput,
  type AmountSnapshot,
  type BasisPointFieldErrors,
  type BasisPointInput,
  type ConversionField,
} from './types';
import { validateAmountSection, validateConversionField } from './validation';

export function BasisPointCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<BasisPointInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<BasisPointFieldErrors>({});
  const [amount, setAmount] = React.useState<AmountSnapshot | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const recomputeAmount = (next: BasisPointInput, conversionErrors: BasisPointFieldErrors) => {
    const amountValidation = validateAmountSection(next);
    setErrors({ ...conversionErrors, ...amountValidation.errors });
    setAmount(amountValidation.amount);
  };

  const handleConversionEdit = (field: ConversionField, value: string) => {
    if (!value.trim()) {
      const cleared: BasisPointInput = {
        ...input,
        decimal: '',
        percent: '',
        permille: '',
        basisPoints: '',
      };
      setInput(cleared);
      recomputeAmount(cleared, {});
      return;
    }

    const { errors: conversionErrors, conversion } = validateConversionField(field, value);
    if (!conversion) {
      const next = { ...input, [field]: value };
      setInput(next);
      recomputeAmount(next, conversionErrors);
      return;
    }

    // Keep the edited field's typed text; sync the other three from conversion.
    const next: BasisPointInput = {
      ...input,
      decimal: field === 'decimal' ? value : conversion.formattedDecimal,
      percent: field === 'percent' ? value : conversion.formattedPercent,
      permille: field === 'permille' ? value : conversion.formattedPermille,
      basisPoints: field === 'basisPoints' ? value : conversion.formattedBasisPoints,
    };
    setInput(next);
    recomputeAmount(next, {});
  };

  const handleAmountEdit = (
    patch: Partial<Pick<BasisPointInput, 'xBps' | 'ofAmount' | 'currency'>>
  ) => {
    const next = { ...input, ...patch };
    setInput(next);
    const amountValidation = validateAmountSection(next);
    setErrors((prev) => ({
      decimal: prev.decimal,
      percent: prev.percent,
      permille: prev.permille,
      basisPoints: prev.basisPoints,
      ...amountValidation.errors,
    }));
    setAmount(amountValidation.amount);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setAmount(null);
  };

  const symbol = getCurrencySymbol(input.currency);
  const hasConversion = Boolean(
    input.decimal || input.percent || input.permille || input.basisPoints
  );
  const summary =
    hasConversion || amount
      ? [
          `${metadata.title} — Omega Calculators`,
          hasConversion
            ? [
                `Decimal: ${input.decimal}`,
                `Percent: ${input.percent}%`,
                `Permille: ${input.permille}‰`,
                `Basis points: ${input.basisPoints} bps`,
              ].join('\n')
            : null,
          amount
            ? [
                `${input.xBps} bps of ${symbol}${input.ofAmount} equals ${symbol}${amount.formattedEquals}`,
                amount.explanation,
              ].join('\n')
            : null,
          CURRENCY_DENOMINATION_NOTE,
        ]
          .filter(Boolean)
          .join('\n')
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
          <p className="text-xs font-normal text-muted-foreground">
            Convert rates and compute x bps of an amount. {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <BasisPointForm
          input={input}
          errors={errors}
          amount={amount}
          onConversionEdit={handleConversionEdit}
          onAmountEdit={handleAmountEdit}
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
        <BasisPointResults />
      </div>
    </section>
  );
}
