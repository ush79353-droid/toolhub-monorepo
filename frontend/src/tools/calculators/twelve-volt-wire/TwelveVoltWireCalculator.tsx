'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateTwelveVolt, type TwelveVoltResult } from './calculation';
import { TwelveVoltWireForm } from './TwelveVoltWireForm';
import { TwelveVoltWireResults } from './TwelveVoltWireResults';
import { createDefaultTwelveVoltInput, type TwelveVoltInput } from './types';
import { validateTwelveVolt } from './validation';

const SAFETY =
  'This calculator provides preliminary 12V DC wire-sizing estimates. Actual conductor selection depends on current, voltage drop, insulation and terminal ratings, installation method, ambient conditions, protective devices and applicable electrical codes. Have a qualified professional verify wiring for safety-critical installations.';

export function TwelveVoltWireCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<TwelveVoltInput>(() => createDefaultTwelveVoltInput());
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [advanced, setAdvanced] = React.useState(false);
  const [result, setResult] = React.useState<TwelveVoltResult | null>(() => calculateTwelveVolt(createDefaultTwelveVoltInput()));
  const [copied, setCopied] = React.useState(false);

  const run = (next: TwelveVoltInput) => {
    const validation = validateTwelveVolt(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateTwelveVolt(next) : null);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Voltage-drop minimum ${result.minimumAreaMm2.toFixed(3)} mm²`,
        result.metric ? `Metric ${result.metric.label}` : 'No listed metric size',
        result.awg ? `AWG ${result.awg.label}` : 'No listed AWG size',
        'Ampacity not verified. Not an installation recommendation.',
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
          <p className="text-xs font-normal text-muted-foreground">12 V DC voltage-drop estimate</p>
        </div>
        {headerActions}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <TwelveVoltWireForm
          input={input}
          errors={errors}
          advanced={advanced}
          onAdvanced={setAdvanced}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
          }}
          onReset={() => {
            const fresh = createDefaultTwelveVoltInput();
            setInput(fresh);
            setErrors({});
            setAdvanced(false);
            setResult(calculateTwelveVolt(fresh));
          }}
        />
        <TwelveVoltWireResults
          result={result}
          copied={copied}
          onCopy={async () => {
            if (!summary) return;
            if (await copyTextToClipboard(summary)) {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }
          }}
        />
        <p className="text-xs leading-relaxed text-muted-foreground">{SAFETY}</p>
      </div>
    </section>
  );
}
