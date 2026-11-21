'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { TurnoverRateForm } from './TurnoverRateForm';
import { TurnoverRateResults } from './TurnoverRateResults';
import type {
  CalculateAverageMode,
  TurnoverRateFieldErrors,
  TurnoverRateInput,
  TurnoverRateResult,
} from './types';
import { validateTurnoverRateInput } from './validation';

const INITIAL_INPUT: TurnoverRateInput = {
  calculateAverage: 'no',
  employeesAtStart: '',
  employeesAtEnd: '',
  averageEmployees: '',
  employeesWhoLeft: '',
};

export function TurnoverRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<TurnoverRateInput>(INITIAL_INPUT);
  const [errors, setErrors] = React.useState<TurnoverRateFieldErrors>({});
  const [result, setResult] = React.useState<TurnoverRateResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const applyValidation = (nextInput: TurnoverRateInput) => {
    const validation = validateTurnoverRateInput(nextInput);
    const withAverage =
      nextInput.calculateAverage === 'yes' && validation.derivedAverage !== null
        ? { ...nextInput, averageEmployees: validation.derivedAverage }
        : nextInput.calculateAverage === 'yes'
          ? { ...nextInput, averageEmployees: '' }
          : nextInput;

    setInput(withAverage);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleInputChange = (field: keyof TurnoverRateInput, value: string) => {
    applyValidation({ ...input, [field]: value });
  };

  const handleModeChange = (mode: CalculateAverageMode) => {
    applyValidation({
      ...input,
      calculateAverage: mode,
      ...(mode === 'no'
        ? { employeesAtStart: '', employeesAtEnd: '' }
        : { averageEmployees: '' }),
    });
  };

  const handleReset = () => {
    setInput(INITIAL_INPUT);
    setErrors({});
    setResult(null);
  };

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        input.calculateAverage === 'yes'
          ? `Employees at start: ${input.employeesAtStart}`
          : null,
        input.calculateAverage === 'yes' ? `Employees at end: ${input.employeesAtEnd}` : null,
        `Average number of employees: ${result.formattedAverage}`,
        `Number of employees who left: ${input.employeesWhoLeft}`,
        `Turnover rate: ${result.formattedRate}%`,
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
            Turnover % = (employees who left ÷ average employees) × 100
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <TurnoverRateForm
          input={input}
          errors={errors}
          result={result}
          onInputChange={handleInputChange}
          onModeChange={handleModeChange}
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
        <TurnoverRateResults />
      </div>
    </section>
  );
}
