'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertUnicodeText } from './calculation';
import { UNICODE_STYLES, DEFAULT_INPUT } from './types';
import { UnicodeTextForm } from './UnicodeTextForm';
import { UnicodeTextResults } from './UnicodeTextResults';
import { validateUnicodeInput } from './validation';

function summaryText(input: string, results: ReturnType<typeof convertUnicodeText>): string {
  const lines = [
    'Unicode Text Converter',
    'Omega Calculators',
    '',
    'Original:',
    input,
    '',
  ];
  for (const meta of UNICODE_STYLES) {
    lines.push(`${meta.label}:`, results[meta.id], '');
  }
  if (typeof window !== 'undefined') {
    lines.push(`Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function UnicodeTextConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [rawInput, setRawInput] = React.useState(DEFAULT_INPUT);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const validated = React.useMemo(() => validateUnicodeInput(rawInput), [rawInput]);
  const results = React.useMemo(
    () => (validated.text.length > 0 ? convertUnicodeText(validated.text) : null),
    [validated.text],
  );

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
            Circled · squared · inverted · monospace
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <UnicodeTextForm
          value={rawInput}
          warning={validated.warning}
          onChange={setRawInput}
          onSubmit={(event) => event.preventDefault()}
          onReload={() => {
            setRawInput(DEFAULT_INPUT);
            setShared(false);
          }}
          onReset={() => {
            setRawInput('');
            setShared(false);
          }}
        >
          <UnicodeTextResults
            results={results}
            hasInput={validated.text.length > 0}
            shared={shared}
            canShare={canShare}
            onShare={() => {
              if (!results) return;
              const payload = summaryText(validated.text, results);
              const markShared = () => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              };
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
            }}
          />
        </UnicodeTextForm>
      </div>
    </section>
  );
}
