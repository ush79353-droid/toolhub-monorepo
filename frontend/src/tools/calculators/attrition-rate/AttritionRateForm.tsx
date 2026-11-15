'use client';

import * as React from 'react';
import { MoreHorizontal, RotateCcw, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { AttritionRateFieldErrors, AttritionRateInput, AttritionRateResult } from './types';

interface AttritionRateFormProps {
  input: AttritionRateInput;
  errors: AttritionRateFieldErrors;
  result: AttritionRateResult | null;
  copied: boolean;
  onInputChange: (field: keyof AttritionRateInput, value: string) => void;
  onReset: () => void;
  onShare: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
          {label}
        </label>
        <InfoTooltip label={label} text={tip} align="left" />
      </div>
      <span className="text-muted-foreground/50 hover:text-muted-foreground cursor-pointer" aria-hidden="true">
        <MoreHorizontal className="h-4 w-4" />
      </span>
    </div>
  );
}

export function AttritionRateForm({
  input,
  errors,
  result,
  copied,
  onInputChange,
  onReset,
  onShare,
}: AttritionRateFormProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  return (
    <div className="space-y-4">
      {/* 1. Employees at the start */}
      <div>
        <FieldLabel
          htmlFor="attrition-start"
          label="Employees at the start"
          tip="The total headcount of employees at the beginning of the measurement period."
        />
        <input
          id="attrition-start"
          type="text"
          inputMode="numeric"
          className={inputClass}
          value={input.startEmployees}
          placeholder=""
          aria-invalid={Boolean(errors.startEmployees)}
          onChange={(e) => onInputChange('startEmployees', e.target.value)}
        />
        {errors.startEmployees ? (
          <p className="mt-1 text-xs text-rose-600">{errors.startEmployees}</p>
        ) : null}
      </div>

      {/* 2. Employees at the end */}
      <div>
        <FieldLabel
          htmlFor="attrition-end"
          label="Employees at the end"
          tip="The total headcount of employees remaining at the end of the measurement period."
        />
        <input
          id="attrition-end"
          type="text"
          inputMode="numeric"
          className={inputClass}
          value={input.endEmployees}
          placeholder=""
          aria-invalid={Boolean(errors.endEmployees)}
          onChange={(e) => onInputChange('endEmployees', e.target.value)}
        />
        {errors.endEmployees ? (
          <p className="mt-1 text-xs text-rose-600">{errors.endEmployees}</p>
        ) : null}
      </div>

      {/* 3. Employees that left */}
      <div>
        <FieldLabel
          htmlFor="attrition-left"
          label="Employees that left"
          tip="The total number of employees who left the organization during this period (voluntarily or involuntarily)."
        />
        <input
          id="attrition-left"
          type="text"
          inputMode="numeric"
          className={inputClass}
          value={input.leftEmployees}
          placeholder=""
          aria-invalid={Boolean(errors.leftEmployees)}
          onChange={(e) => onInputChange('leftEmployees', e.target.value)}
        />
        {errors.leftEmployees ? (
          <p className="mt-1 text-xs text-rose-600">{errors.leftEmployees}</p>
        ) : null}
      </div>

      {/* General validation error if any */}
      {errors.general ? (
        <p className="text-xs text-rose-600">{errors.general}</p>
      ) : null}

      {/* 4. Attrition rate (Calculated Output) */}
      <div>
        <FieldLabel
          htmlFor="attrition-rate"
          label="Attrition rate"
          tip="The calculated attrition rate percentage: (Employees that left / Average employees) × 100."
        />
        <div className="relative">
          <input
            id="attrition-rate"
            type="text"
            readOnly
            className={`${inputClass} pr-8 font-semibold text-accent ${
              result ? 'bg-brand-softTeal/30' : 'bg-muted/10'
            }`}
            value={result ? result.formattedRate : ''}
            placeholder=""
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-primary">
            %
          </span>
        </div>
        {result ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Average headcount: {result.averageEmployees.toLocaleString('en-US')} employees
          </p>
        ) : null}
      </div>

      {/* Action Controls matching screenshot */}
      <div className="border-t border-border/80 pt-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* Share Result */}
          <button
            type="button"
            onClick={onShare}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Link Copied!' : 'Share result'}
            </span>
          </button>

          {/* Reload / Clear Controls */}
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center gap-1.5 rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={onReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-full justify-center text-xs font-normal text-muted-foreground hover:text-foreground"
              onClick={onReset}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        {/* Feedback widget from screenshot */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
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
    </div>
  );
}
