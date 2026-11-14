'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { DecimalValue } from '../billion-to-trillion/types';
import { formatStorageDisplay, fromBytes, toBytes } from './calculation';
import {
  ByteConversionForm,
  defaultDraft,
  emptyDraft,
  type ByteConversionDraft,
} from './ByteConversionForm';
import { ByteConversionResults } from './ByteConversionResults';
import {
  PRIMARY_FIELDS,
  STORAGE_UNIT_BY_ID,
  type ByteConversionFieldErrors,
  type PrimaryField,
  type StorageUnit,
} from './types';
import { parseStorageInput } from './validation';

function draftFromBytes(
  bytes: DecimalValue,
  extraUnit: StorageUnit,
  preserve: { field: NonNullable<ByteConversionDraft['activeField']>; text: string } | null
): ByteConversionDraft {
  const texts = {} as Record<PrimaryField, string>;
  for (const field of PRIMARY_FIELDS) {
    texts[field] =
      preserve?.field === field
        ? preserve.text
        : formatStorageDisplay(fromBytes(bytes, field));
  }
  return {
    texts,
    extraText:
      preserve?.field === 'extra'
        ? preserve.text
        : formatStorageDisplay(fromBytes(bytes, extraUnit)),
    extraUnit,
    activeField: preserve?.field ?? null,
  };
}

function summaryText(
  values: Record<PrimaryField, string>,
  extraValue: string,
  extraUnit: StorageUnit
): string {
  const lines = [
    'Byte Conversion Calculator',
    'Omega Calculators',
    '',
    `${values.B} Bytes = ${values.KB} Kilobyte(s)`,
    `${values.B} Bytes = ${values.MB} Megabyte(s)`,
    `${values.B} Bytes = ${values.GB} Gigabyte(s)`,
    `${values.B} Bytes = ${extraValue} ${STORAGE_UNIT_BY_ID[extraUnit].label}`,
    '',
    'Decimal units use powers of 1000.',
    'Binary units use powers of 1024.',
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function ByteConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<ByteConversionDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<ByteConversionFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const bytesRef = React.useRef<DecimalValue | null>(
    toBytes({ sign: 1, digits: '1000', exp: 0 }, 'B')
  );
  const extraUnitRef = React.useRef<StorageUnit>(draft.extraUnit);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: ByteConversionDraft) => {
    const previousExtra = extraUnitRef.current;
    extraUnitRef.current = next.extraUnit;

    // Extra unit changed while not typing in extra → refresh extra from stored bytes
    if (
      next.extraUnit !== previousExtra &&
      next.activeField !== 'extra' &&
      bytesRef.current
    ) {
      const preserve =
        next.activeField != null
          ? { field: next.activeField, text: next.texts[next.activeField] }
          : null;
      setDraft(draftFromBytes(bytesRef.current, next.extraUnit, preserve));
      setErrors({});
      setHasResult(true);
      return;
    }

    const field = next.activeField ?? 'B';
    const sourceUnit: StorageUnit = field === 'extra' ? next.extraUnit : field;
    const sourceText = field === 'extra' ? next.extraText : next.texts[field];

    const parsed = parseStorageInput(sourceText);
    if (parsed.blank) {
      bytesRef.current = null;
      setDraft({
        texts: {
          B: field === 'B' ? sourceText : '',
          KB: field === 'KB' ? sourceText : '',
          MB: field === 'MB' ? sourceText : '',
          GB: field === 'GB' ? sourceText : '',
        },
        extraText: field === 'extra' ? sourceText : '',
        extraUnit: next.extraUnit,
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
        bytesRef.current = null;
      }
      return;
    }

    const bytes = toBytes(parsed.value, sourceUnit);
    bytesRef.current = bytes;
    setDraft(draftFromBytes(bytes, next.extraUnit, { field, text: sourceText }));
    setErrors({});
    setHasResult(true);
  }, []);

  const clearAll = (reload: boolean) => {
    if (reload) {
      bytesRef.current = toBytes({ sign: 1, digits: '1000', exp: 0 }, 'B');
      extraUnitRef.current = 'KiB';
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      bytesRef.current = null;
      setDraft(emptyDraft(draft.extraUnit));
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const values = hasResult
    ? ({
        B: draft.texts.B,
        KB: draft.texts.KB,
        MB: draft.texts.MB,
        GB: draft.texts.GB,
      } as Record<PrimaryField, string>)
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
            Bytes · KB/MB/GB · KiB/MiB/GiB · bits
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ByteConversionForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'B' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <ByteConversionResults
            values={values}
            extraValue={hasResult ? draft.extraText : null}
            extraUnit={draft.extraUnit}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!values) return;
              void copyTextToClipboard(
                summaryText(values, draft.extraText, draft.extraUnit)
              ).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!values || typeof navigator.share !== 'function') return;
              const payload = summaryText(values, draft.extraText, draft.extraUnit);
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
        </ByteConversionForm>
      </div>
    </section>
  );
}
