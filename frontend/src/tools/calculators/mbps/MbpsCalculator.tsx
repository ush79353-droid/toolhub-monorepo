'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { DecimalValue } from '../billion-to-trillion/types';
import {
  formatRateDisplay,
  fromBitsPerSecond,
  toBitsPerSecond,
} from './calculation';
import {
  MbpsForm,
  defaultDraft,
  emptyDraft,
  type MbpsDraft,
} from './MbpsForm';
import { MbpsResults } from './MbpsResults';
import { ALL_FIELDS, type DataRateUnit, type MbpsFieldErrors } from './types';
import { parseRateInput } from './validation';

function draftFromBps(
  bps: DecimalValue,
  preserve: { field: DataRateUnit; text: string } | null,
  open: Pick<MbpsDraft, 'primaryOpen' | 'bitsOpen' | 'bytesOpen'>,
): MbpsDraft {
  const texts = {} as Record<DataRateUnit, string>;
  for (const field of ALL_FIELDS) {
    texts[field] =
      preserve?.field === field
        ? preserve.text
        : formatRateDisplay(fromBitsPerSecond(bps, field));
  }
  return {
    texts,
    activeField: preserve?.field ?? null,
    ...open,
  };
}

function summaryText(values: Record<DataRateUnit, string>): string {
  const lines = [
    'Mbps Calculator',
    'Omega Calculators',
    '',
    'Megabits per second:',
    `${values['Mbit/s']} Mbps`,
    '',
    'Megabytes per second:',
    `${values['MB/s']} MB/s`,
    '',
    'Gigabits per second:',
    `${values['Gbit/s']} Gbps`,
    '',
    'Formula:',
    'MB/s = Mbps ÷ 8',
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function MbpsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MbpsDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<MbpsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const bpsRef = React.useRef<DecimalValue | null>(
    toBitsPerSecond({ sign: 1, digits: '100', exp: 0 }, 'Mbit/s'),
  );

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const openState = React.useCallback(
    (next: MbpsDraft): Pick<MbpsDraft, 'primaryOpen' | 'bitsOpen' | 'bytesOpen'> => ({
      primaryOpen: next.primaryOpen,
      bitsOpen: next.bitsOpen,
      bytesOpen: next.bytesOpen,
    }),
    [],
  );

  const evaluate = React.useCallback(
    (next: MbpsDraft) => {
      const field = next.activeField ?? 'Mbit/s';
      const sourceText = next.texts[field];
      const parsed = parseRateInput(sourceText);

      if (parsed.blank) {
        bpsRef.current = null;
        const texts = {} as Record<DataRateUnit, string>;
        for (const f of ALL_FIELDS) {
          texts[f] = f === field ? sourceText : '';
        }
        setDraft({ ...next, texts, activeField: field });
        setErrors({});
        setHasResult(false);
        return;
      }

      if (!parsed.value) {
        setDraft(next);
        if (parsed.error) {
          setErrors({ [field]: parsed.error });
          setHasResult(false);
          bpsRef.current = null;
        }
        return;
      }

      const bps = toBitsPerSecond(parsed.value, field);
      bpsRef.current = bps;
      setDraft(draftFromBps(bps, { field, text: sourceText }, openState(next)));
      setErrors({});
      setHasResult(true);
    },
    [openState],
  );

  const clearAll = (reload: boolean) => {
    if (reload) {
      bpsRef.current = toBitsPerSecond({ sign: 1, digits: '100', exp: 0 }, 'Mbit/s');
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      bpsRef.current = null;
      setDraft(emptyDraft());
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const applyExample = (id: 1 | 2) => {
    if (id === 1) {
      evaluate({
        ...defaultDraft(),
        texts: { ...defaultDraft().texts, 'Mbit/s': '100' },
        activeField: 'Mbit/s',
        bitsOpen: true,
        bytesOpen: false,
      });
      return;
    }
    evaluate({
      ...defaultDraft(),
      texts: { ...defaultDraft().texts, 'Gbit/s': '1' },
      activeField: 'Gbit/s',
      bitsOpen: true,
      bytesOpen: false,
    });
  };

  const values = hasResult
    ? (ALL_FIELDS.reduce(
        (acc, field) => {
          acc[field] = draft.texts[field];
          return acc;
        },
        {} as Record<DataRateUnit, string>,
      ))
    : null;

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
            Mbps · MB/s · bit/s · Gbit/s · B/s
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MbpsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'Mbit/s' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
          onApplyExample={applyExample}
        >
          <MbpsResults
            values={values}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!values) return;
              void copyTextToClipboard(summaryText(values)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!values) return;
              const payload = summaryText(values);
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text: payload,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(payload).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
                return;
              }
              void copyTextToClipboard(payload).then((ok) => {
                if (!ok) return;
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              });
            }}
          />
        </MbpsForm>
      </div>
    </section>
  );
}
