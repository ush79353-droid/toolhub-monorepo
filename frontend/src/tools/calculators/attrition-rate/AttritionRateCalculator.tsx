'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { AttritionRateForm } from './AttritionRateForm';
import { AttritionRateResults } from './AttritionRateResults';
import { calculateAttritionRate } from './calculation';
import type { AttritionRateFieldErrors, AttritionRateInput, AttritionRateResult } from './types';
import { validateAttritionRateInput } from './validation';

const INITIAL_INPUT: AttritionRateInput = {
  startEmployees: '',
  endEmployees: '',
  leftEmployees: '',
};

export function AttritionRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<AttritionRateInput>(INITIAL_INPUT);
  const [errors, setErrors] = React.useState<AttritionRateFieldErrors>({});
  const [result, setResult] = React.useState<AttritionRateResult | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Automatic calculation whenever inputs change
  const handleInputChange = (field: keyof AttritionRateInput, value: string) => {
    const nextInput = { ...input, [field]: value };
    setInput(nextInput);

    const validation = validateAttritionRateInput(nextInput);
    setErrors(validation.errors);

    if (validation.isValid && validation.parsedValues) {
      const { start, end, left } = validation.parsedValues;
      const res = calculateAttritionRate(start, end, left);
      setResult(res);
    } else {
      setResult(null);
    }
  };

  const handleReset = () => {
    setInput(INITIAL_INPUT);
    setErrors({});
    setResult(null);
  };

  const handleShare = async () => {
    const summary = result
      ? [
          `${metadata.title} | Omega Calculators`,
          `Employees at start: ${input.startEmployees}`,
          `Employees at end: ${input.endEmployees}`,
          `Employees that left: ${input.leftEmployees}`,
          `Average headcount: ${result.averageEmployees}`,
          `Attrition rate: ${result.formattedRate}%`,
        ].join('\n')
      : `${metadata.title}; Calculate employee attrition rate accurately at Omega Calculators`;

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
          <p className="text-xs font-normal text-muted-foreground">Employee attrition rate calculation</p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="p-4 sm:p-5">
        <AttritionRateForm
          input={input}
          errors={errors}
          result={result}
          copied={copied}
          onInputChange={handleInputChange}
          onReset={handleReset}
          onShare={handleShare}
        />
        <AttritionRateResults input={input} result={result} />
      </div>
    </section>
  );
}
