'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildResult, formatMass, fromKilograms, toKilograms } from './calculation';
import { WeightConverterForm, type WeightConverterDraft } from './WeightConverterForm';
import { WeightConverterResults } from './WeightConverterResults';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_KILOGRAMS,
  MASS_UNIT_BY_ID,
  type WeightConverterFieldErrors,
  type WeightConverterResult,
  type WeightFieldId,
} from './types';
import { massErrorMessage, massValueState, parseOptionalNumber } from './validation';

type DraftFlags = Pick<
  WeightConverterDraft,
  'otherOpen' | 'metricOpen' | 'imperialOpen' | 'otherGroupOpen'
>;

function emptyDraft(): WeightConverterDraft {
  return {
    texts: ['', '', '', '', '', '', '', ''],
    units: [...DEFAULT_FIELD_UNITS],
    activeField: null,
    otherOpen: false,
    metricOpen: true,
    imperialOpen: true,
    otherGroupOpen: true,
  };
}

function draftFromKilograms(
  kilograms: number,
  units: WeightConverterDraft['units'],
  preserveField: WeightFieldId | null,
  preserveText: string,
  flags: DraftFlags
): WeightConverterDraft {
  const values = [
    fromKilograms(kilograms, units[0]),
    fromKilograms(kilograms, units[1]),
    fromKilograms(kilograms, units[2]),
    fromKilograms(kilograms, units[3]),
    fromKilograms(kilograms, units[4]),
    fromKilograms(kilograms, units[5]),
    fromKilograms(kilograms, units[6]),
    fromKilograms(kilograms, units[7]),
  ] as const;

  const texts = values.map((v, i) =>
    preserveField === i ? preserveText : formatMass(v)
  ) as WeightConverterDraft['texts'];

  return {
    texts,
    units,
    activeField: preserveField,
    ...flags,
  };
}

function summaryText(result: WeightConverterResult): string {
  const lines = ['Weight Converter', 'Omega Calculators', ''];
  result.values.forEach((value, index) => {
    const symbol = MASS_UNIT_BY_ID[result.units[index]!].symbol;
    lines.push(`${formatMass(value)} ${symbol}`);
  });
  lines.push('', `Canonical: ${formatMass(result.kilograms)} kg`);
  return lines.join('\n');
}

export function WeightConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<WeightConverterDraft>(() =>
    draftFromKilograms(DEFAULT_KILOGRAMS, [...DEFAULT_FIELD_UNITS], null, '', {
      otherOpen: false,
      metricOpen: true,
      imperialOpen: true,
      otherGroupOpen: true,
    })
  );
  const [errors, setErrors] = React.useState<WeightConverterFieldErrors>({});
  const [result, setResult] = React.useState<WeightConverterResult | null>(() =>
    buildResult(DEFAULT_KILOGRAMS, [...DEFAULT_FIELD_UNITS])
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  const kilogramsRef = React.useRef<number | null>(DEFAULT_KILOGRAMS);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: WeightConverterDraft) => {
      const field = next.activeField;
      const flags: DraftFlags = {
        otherOpen: next.otherOpen,
        metricOpen: next.metricOpen,
        imperialOpen: next.imperialOpen,
        otherGroupOpen: next.otherGroupOpen,
      };

      if (
        field === draft.activeField &&
        next.texts.every((t, i) => t === draft.texts[i]) &&
        next.units.every((u, i) => u === draft.units[i]) &&
        (next.otherOpen !== draft.otherOpen ||
          next.metricOpen !== draft.metricOpen ||
          next.imperialOpen !== draft.imperialOpen ||
          next.otherGroupOpen !== draft.otherGroupOpen)
      ) {
        setDraft(next);
        return;
      }

      if (
        field !== null &&
        next.texts[field] === draft.texts[field] &&
        next.units[field] !== draft.units[field]
      ) {
        const kilograms = kilogramsRef.current;
        if (kilograms === null) {
          setDraft(next);
          return;
        }
        const synced = draftFromKilograms(kilograms, next.units, null, '', flags);
        setDraft(synced);
        setErrors({});
        setResult(buildResult(kilograms, next.units));
        return;
      }

      if (field === null) {
        setDraft(next);
        return;
      }

      const parsed = parseOptionalNumber(next.texts[field]);
      const state = massValueState(parsed);
      const message = massErrorMessage(state);
      const nextErrors: WeightConverterFieldErrors = {};
      if (message) nextErrors[field] = message;

      if (state === 'blank') {
        kilogramsRef.current = null;
        setDraft({
          ...next,
          texts: ['', '', '', '', '', '', '', ''],
        });
        setErrors({});
        setResult(null);
        return;
      }

      if (state !== 'ok' || parsed === null) {
        setDraft(next);
        setErrors(nextErrors);
        setResult(null);
        return;
      }

      const kilograms = toKilograms(parsed, next.units[field]);
      kilogramsRef.current = kilograms;
      const synced = draftFromKilograms(kilograms, next.units, field, next.texts[field], flags);
      setDraft(synced);
      setErrors({});
      setResult(buildResult(kilograms, next.units));
    },
    [draft]
  );

  const sharePayload = result ? summaryText(result) : '';

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
            Metric, imperial, troy &amp; scientific · base kg
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <WeightConverterForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            kilogramsRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <WeightConverterResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}
