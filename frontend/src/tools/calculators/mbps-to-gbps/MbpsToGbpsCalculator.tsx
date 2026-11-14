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
  MbpsToGbpsForm,
  defaultDraft,
  emptyDraft,
  type MbpsToGbpsDraft,
} from './MbpsToGbpsForm';
import { MbpsToGbpsResults } from './MbpsToGbpsResults';
import {
  DATA_RATE_UNIT_BY_ID,
  RATE_FIELDS,
  type DataRateUnit,
  type MbpsToGbpsFieldErrors,
} from './types';
import { parseRateInput } from './validation';

function draftFromBps(
  bps: DecimalValue,
  preserve: { field: DataRateUnit; text: string } | null
): MbpsToGbpsDraft {
  const texts = {} as Record<DataRateUnit, string>;
  for (const field of RATE_FIELDS) {
    texts[field] =
      preserve?.field === field
        ? preserve.text
        : formatRateDisplay(fromBitsPerSecond(bps, field));
  }
  return { texts, activeField: preserve?.field ?? null };
}

function summaryText(values: Record<DataRateUnit, string>): string {
  const lines = [
    'Mbps to Gbps Converter',
    'Omega Calculators',
    '',
    `${values.Mbps} Mbps = ${values.Gbps} Gbps`,
    `${values.Mbps} Mbps = ${values.GBps} GB/s`,
    '',
    '1 Gbps = 1000 Mbps',
    '1 GB/s = 8 Gbps',
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function MbpsToGbpsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MbpsToGbpsDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<MbpsToGbpsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const bpsRef = React.useRef<DecimalValue | null>(
    toBitsPerSecond({ sign: 1, digits: '1000', exp: 0 }, 'Mbps')
  );

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: MbpsToGbpsDraft) => {
    const field = next.activeField ?? 'Mbps';
    const sourceText = next.texts[field];
    const parsed = parseRateInput(sourceText);

    if (parsed.blank) {
      bpsRef.current = null;
      setDraft({
        texts: {
          Mbps: field === 'Mbps' ? sourceText : '',
          Gbps: field === 'Gbps' ? sourceText : '',
          GBps: field === 'GBps' ? sourceText : '',
        },
        activeField: field,
      });
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
    setDraft(draftFromBps(bps, { field, text: sourceText }));
    setErrors({});
    setHasResult(true);
  }, []);

  const clearAll = (reload: boolean) => {
    if (reload) {
      bpsRef.current = toBitsPerSecond({ sign: 1, digits: '1000', exp: 0 }, 'Mbps');
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

  const values = hasResult
    ? ({
        Mbps: draft.texts.Mbps,
        Gbps: draft.texts.Gbps,
        GBps: draft.texts.GBps,
      } as Record<DataRateUnit, string>)
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
            Mbps · Gbps · GB/s ({DATA_RATE_UNIT_BY_ID.GBps.symbol})
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MbpsToGbpsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'Mbps' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <MbpsToGbpsResults
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
              if (!values || typeof navigator.share !== 'function') return;
              const payload = summaryText(values);
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
            }}
          />
        </MbpsToGbpsForm>
      </div>
    </section>
  );
}
