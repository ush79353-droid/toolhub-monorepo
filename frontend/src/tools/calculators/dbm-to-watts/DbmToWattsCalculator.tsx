'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convert, formatPower, shareResultText } from './calculation';
import { DbmToWattsForm, emptyDraft, type DbmToWattsDraft } from './DbmToWattsForm';
import { DbmToWattsResults } from './DbmToWattsResults';
import {
  DEFAULT_MODE,
  type ConversionMode,
  type DbmFieldErrors,
} from './types';
import { parseDbmInput } from './validation';

export function DbmToWattsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<DbmToWattsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<DbmFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const resultRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: DbmToWattsDraft) => {
    const parsed = parseDbmInput(next.input, next.mode);

    if (parsed.blank) {
      resultRef.current = null;
      setDraft({ ...next, output: '' });
      setErrors({});
      setHasResult(false);
      return;
    }
    if (parsed.incomplete) {
      setDraft({ ...next, output: '' });
      setErrors({});
      setHasResult(false);
      return;
    }
    if (parsed.value == null) {
      resultRef.current = null;
      setDraft({ ...next, output: '' });
      setErrors({ input: parsed.error ?? 'Enter a valid finite number.' });
      setHasResult(false);
      return;
    }

    const converted = convert(next.mode, parsed.value);
    if (!converted.ok) {
      resultRef.current = null;
      setDraft({ ...next, output: '' });
      setErrors({ input: converted.error });
      setHasResult(false);
      return;
    }

    resultRef.current = converted.value;
    setDraft({
      ...next,
      output: formatPower(converted.value),
    });
    setErrors({});
    setHasResult(true);
  };

  const changeMode = (mode: ConversionMode) => {
    resultRef.current = null;
    setDraft(emptyDraft(mode));
    setErrors({});
    setHasResult(false);
    setCopied(false);
    setShared(false);
  };

  const clearFields = () => {
    resultRef.current = null;
    setDraft(emptyDraft(draft.mode));
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    resultRef.current = null;
    setDraft(emptyDraft(DEFAULT_MODE));
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const inputDisplay = hasResult ? draft.input.trim() : null;
  const outputDisplay = hasResult ? draft.output : null;
  const sharePayload =
    hasResult && draft.output
      ? shareResultText({
          mode: draft.mode,
          inputValue: draft.input.trim().replace(/,/g, ''),
          outputValue: draft.output,
        })
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
          <h2 className="text-[15px] font-semibold text-accent">dBm to Watts Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            dBm · watts · milliwatts
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <DbmToWattsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onModeChange={changeMode}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <DbmToWattsResults
            mode={draft.mode}
            inputDisplay={inputDisplay}
            outputDisplay={outputDisplay}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!sharePayload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${sharePayload}\n\nExplore: ${window.location.href}`
                  : sharePayload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!sharePayload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${sharePayload}\n\nExplore: ${window.location.href}`
                  : sharePayload;
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(text).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
                return;
              }
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              });
            }}
          />
        </DbmToWattsForm>
      </div>
    </section>
  );
}
