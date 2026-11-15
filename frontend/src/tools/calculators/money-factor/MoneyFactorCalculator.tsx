'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { MoneyFactorForm } from './MoneyFactorForm';
import {
  createDefaultInput,
  type MoneyFactorFieldErrors,
  type MoneyFactorInput,
  type MoneyFactorSourceField,
} from './types';
import { validateMoneyFactorInput } from './validation';

export function MoneyFactorCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<MoneyFactorInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<MoneyFactorFieldErrors>({});
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleChange = (field: MoneyFactorSourceField, value: string) => {
    if (!value.trim()) {
      setInput({
        interestRate: '',
        moneyFactor: '',
        sourceField: field,
      });
      setErrors({});
      return;
    }

    const next: MoneyFactorInput = {
      ...input,
      sourceField: field,
      [field]: value,
    };

    const validation = validateMoneyFactorInput(next);
    setErrors(validation.errors);

    if (!validation.result) {
      setInput(next);
      return;
    }

    setInput({
      sourceField: field,
      interestRate:
        field === 'interestRate' ? value : validation.result.formattedInterestRate,
      moneyFactor:
        field === 'moneyFactor' ? value : validation.result.formattedMoneyFactor,
    });
  };

  const handleReset = () => {
    setInput(createDefaultInput());
    setErrors({});
  };

  const hasResult = Boolean(input.interestRate.trim() && input.moneyFactor.trim() && !errors.interestRate && !errors.moneyFactor && !errors.form);
  const summary = hasResult
    ? [
        `${metadata.title} — Omega Calculators`,
        `Interest rate: ${input.interestRate}%`,
        `Money factor: ${input.moneyFactor}`,
        'Money factor = interest rate (%) ÷ 2400',
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
          <p className="text-xs font-normal text-muted-foreground">
            Money factor = annual interest rate (%) ÷ 2400. Edit either field.
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <MoneyFactorForm
          input={input}
          errors={errors}
          onChange={handleChange}
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
