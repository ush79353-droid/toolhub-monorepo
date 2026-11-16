'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { shareResultText, textStats, transformCase } from './calculation';
import { LowercaseToUppercaseForm } from './LowercaseToUppercaseForm';
import { LowercaseToUppercaseResults } from './LowercaseToUppercaseResults';
import type { CaseMode } from './types';
import { validateUppercaseInput } from './validation';

export function LowercaseToUppercaseConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [rawInput, setRawInput] = React.useState('');
  const [mode, setMode] = React.useState<CaseMode>('uppercase');
  const [shared, setShared] = React.useState(false);

  const validated = React.useMemo(() => validateUppercaseInput(rawInput), [rawInput]);
  const output = React.useMemo(
    () => (validated.text.length > 0 ? transformCase(validated.text, mode) : ''),
    [validated.text, mode],
  );
  const stats = React.useMemo(() => textStats(validated.text), [validated.text]);
  const hasInput = validated.text.length > 0;

  const markShared = () => {
    setShared(true);
    window.setTimeout(() => setShared(false), 2000);
  };

  const share = () => {
    if (!hasInput) return;
    const payload =
      typeof window !== 'undefined'
        ? `${shareResultText(validated.text, output, mode)}\n\nExplore: ${window.location.href}`
        : shareResultText(validated.text, output, mode);
    if (typeof navigator.share === 'function') {
      void navigator
        .share({
          title: metadata.title,
          text: payload,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        })
        .then(markShared)
        .catch(() => {
          void copyTextToClipboard(payload).then((ok) => {
            if (ok) markShared();
          });
        });
      return;
    }
    void copyTextToClipboard(payload).then((ok) => {
      if (ok) markShared();
    });
  };

  const reset = () => {
    setRawInput('');
    setMode('uppercase');
    setShared(false);
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
            hello world → HELLO WORLD
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LowercaseToUppercaseForm
          value={rawInput}
          mode={mode}
          warning={validated.warning}
          onChange={setRawInput}
          onModeChange={(next) => {
            setMode(next);
            setShared(false);
          }}
          onSubmit={(event) => event.preventDefault()}
          onReload={reset}
          onReset={reset}
        >
          <LowercaseToUppercaseResults
            output={output}
            hasInput={hasInput}
            characters={stats.characters}
            words={stats.words}
            lines={stats.lines}
            shared={shared}
            canShare={hasInput}
            onShare={share}
          />
        </LowercaseToUppercaseForm>
      </div>
    </section>
  );
}
