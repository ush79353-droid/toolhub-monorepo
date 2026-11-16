'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertToLowercase, shareResultText, textStats } from './calculation';
import { UppercaseToLowercaseForm } from './UppercaseToLowercaseForm';
import { UppercaseToLowercaseResults } from './UppercaseToLowercaseResults';
import { validateLowercaseInput } from './validation';

export function UppercaseToLowercaseConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [rawInput, setRawInput] = React.useState('');
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const validated = React.useMemo(() => validateLowercaseInput(rawInput), [rawInput]);
  const output = React.useMemo(
    () => (validated.text.length > 0 ? convertToLowercase(validated.text) : ''),
    [validated.text],
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
        ? `${shareResultText(validated.text, output)}\n\nExplore: ${window.location.href}`
        : shareResultText(validated.text, output);
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
            HELLO WORLD → hello world
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <UppercaseToLowercaseForm
          value={rawInput}
          warning={validated.warning}
          onChange={setRawInput}
          onSubmit={(event) => event.preventDefault()}
          onReload={() => {
            setRawInput('');
            setShared(false);
          }}
          onReset={() => {
            setRawInput('');
            setShared(false);
          }}
        >
          <UppercaseToLowercaseResults
            output={output}
            hasInput={hasInput}
            characters={stats.characters}
            words={stats.words}
            lines={stats.lines}
            shared={shared}
            canShare={canShare || hasInput}
            onShare={share}
          />
        </UppercaseToLowercaseForm>
      </div>
    </section>
  );
}
