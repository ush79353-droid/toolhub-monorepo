'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertHardness, shareResultText } from './calculation';
import { emptyDraft, HardnessForm, type HardnessDraft } from './HardnessForm';
import { HardnessResults } from './HardnessResults';
import type { HardnessConversionResult, HardnessFieldErrors } from './types';
import { parseHardnessInput } from './validation';

export function HardnessConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<HardnessDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<HardnessFieldErrors>({});
  const [result, setResult] = React.useState<HardnessConversionResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: HardnessDraft) => {
    setDraft(next);
    const parsed = parseHardnessInput(next.value);
    if (parsed.blank) {
      setErrors({});
      setResult(null);
      return;
    }
    if (parsed.incomplete) {
      setErrors({});
      return;
    }
    if (parsed.value == null) {
      setErrors({ value: parsed.error ?? 'Enter a valid finite number.' });
      setResult(null);
      return;
    }
    setErrors({});
    setResult(
      convertHardness({
        value: parsed.value,
        scale: next.scale,
        material: next.material,
      }),
    );
  };

  const clearFields = () => {
    setDraft({ ...emptyDraft(), scale: draft.scale, material: draft.material });
    setResult(null);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    setDraft(emptyDraft());
    setResult(null);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const payload = result ? shareResultText(result) : '';
  const canAct =
    Boolean(result) &&
    !result!.warnings.some((w) => w.includes('No verified conversion'));

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
            HBW · HRB · HRC · HV (approximate)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <HardnessForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <HardnessResults
            result={result}
            pending={!result}
            copied={copied}
            shared={shared}
            canShare={canShare && canAct}
            onCopy={() => {
              if (!payload || !canAct) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
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
        </HardnessForm>
      </div>
    </section>
  );
}
