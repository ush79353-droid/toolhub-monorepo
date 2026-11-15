'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildResult, formatPressure, fromPascals, toPascals } from './calculation';
import {
  PressureConverterForm,
  type PressureConverterDraft,
} from './PressureConverterForm';
import { PressureConverterResults } from './PressureConverterResults';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_PASCALS,
  PRESSURE_UNIT_BY_ID,
  type PressureConverterFieldErrors,
  type PressureConverterResult,
  type PressureFieldId,
} from './types';
import { parseOptionalNumber, pressureErrorMessage, pressureValueState } from './validation';

function emptyDraft(): PressureConverterDraft {
  return {
    texts: ['', '', '', ''],
    units: [...DEFAULT_FIELD_UNITS],
    activeField: null,
    otherOpen: false,
  };
}

function draftFromPascals(
  pascals: number,
  units: PressureConverterDraft['units'],
  preserveField: PressureFieldId | null,
  preserveText: string,
  otherOpen: boolean
): PressureConverterDraft {
  const values = [
    fromPascals(pascals, units[0]),
    fromPascals(pascals, units[1]),
    fromPascals(pascals, units[2]),
    fromPascals(pascals, units[3]),
  ] as const;

  const texts = values.map((v, i) =>
    preserveField === i ? preserveText : formatPressure(v)
  ) as PressureConverterDraft['texts'];

  return {
    texts,
    units,
    activeField: preserveField,
    otherOpen,
  };
}

function summaryText(result: PressureConverterResult): string {
  const lines = ['Pressure Conversion', 'Omega Calculators', ''];
  result.values.forEach((value, index) => {
    const symbol = PRESSURE_UNIT_BY_ID[result.units[index]!].symbol;
    lines.push(`${formatPressure(value)} ${symbol}`);
  });
  lines.push('', `Canonical: ${formatPressure(result.pascals)} Pa`);
  return lines.join('\n');
}

export function PressureConversion({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PressureConverterDraft>(() =>
    draftFromPascals(DEFAULT_PASCALS, [...DEFAULT_FIELD_UNITS], null, '', false)
  );
  const [errors, setErrors] = React.useState<PressureConverterFieldErrors>({});
  const [result, setResult] = React.useState<PressureConverterResult | null>(() =>
    buildResult(DEFAULT_PASCALS, [...DEFAULT_FIELD_UNITS])
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  const pascalsRef = React.useRef<number | null>(DEFAULT_PASCALS);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: PressureConverterDraft) => {
      const field = next.activeField;

      if (
        field === draft.activeField &&
        next.texts.every((t, i) => t === draft.texts[i]) &&
        next.units.every((u, i) => u === draft.units[i]) &&
        next.otherOpen !== draft.otherOpen
      ) {
        setDraft(next);
        return;
      }

      if (
        field !== null &&
        next.texts[field] === draft.texts[field] &&
        next.units[field] !== draft.units[field]
      ) {
        const pascals = pascalsRef.current;
        if (pascals === null) {
          setDraft(next);
          return;
        }
        const synced = draftFromPascals(pascals, next.units, null, '', next.otherOpen);
        setDraft(synced);
        setErrors({});
        setResult(buildResult(pascals, next.units));
        return;
      }

      if (field === null) {
        setDraft(next);
        return;
      }

      const parsed = parseOptionalNumber(next.texts[field]);
      const state = pressureValueState(parsed);
      const message = pressureErrorMessage(state);
      const nextErrors: PressureConverterFieldErrors = {};
      if (message) nextErrors[field] = message;

      if (state === 'blank') {
        pascalsRef.current = null;
        setDraft({
          ...next,
          texts: ['', '', '', ''],
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

      const pascals = toPascals(parsed, next.units[field]);
      pascalsRef.current = pascals;
      const synced = draftFromPascals(
        pascals,
        next.units,
        field,
        next.texts[field],
        next.otherOpen
      );
      setDraft(synced);
      setErrors({});
      setResult(buildResult(pascals, next.units));
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
            bar · psi · atm · Pa · base Pa
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PressureConverterForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            pascalsRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <PressureConverterResults
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
