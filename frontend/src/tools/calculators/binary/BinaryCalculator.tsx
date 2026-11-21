'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  buildBinaryToDecimal,
  buildDecimalToBinary,
  formatSignedInt,
} from './calculation';
import { BinaryForm, defaultDraft, emptyDraft, type BinaryDraft } from './BinaryForm';
import { BinaryResults } from './BinaryResults';
import type { BinaryFieldErrors } from './types';
import {
  binaryIncompleteMessage,
  parseBinaryInput,
  parseDecimalInput,
} from './validation';

function summaryText(args: {
  bits: number;
  decimalInput: string | null;
  binaryFromDecimal: string | null;
  binaryInput: string | null;
  decimalFromBinary: string | null;
}): string {
  const lines = [
    'Binary Converter | Omega Calculators',
    '',
    `Representation: Signed ${args.bits}-bit`,
    '',
  ];
  if (args.decimalInput && args.binaryFromDecimal) {
    lines.push(`Decimal: ${args.decimalInput}`);
    lines.push(`Binary: ${args.binaryFromDecimal}`);
    lines.push('');
  }
  if (args.binaryInput && args.decimalFromBinary) {
    lines.push(`Binary: ${args.binaryInput}`);
    lines.push(`Decimal: ${args.decimalFromBinary}`);
  }
  return lines.join('\n').trimEnd();
}

export function BinaryConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<BinaryDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<BinaryFieldErrors>({});
  const [binaryHint, setBinaryHint] = React.useState<string | undefined>();
  const [binaryFromDecimal, setBinaryFromDecimal] = React.useState<string | null>(null);
  const [decimalFromBinary, setDecimalFromBinary] = React.useState<string | null>(null);
  const [decimalInputDisplay, setDecimalInputDisplay] = React.useState<string | null>(null);
  const [binaryInputDisplay, setBinaryInputDisplay] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: BinaryDraft) => {
    const nextErrors: BinaryFieldErrors = {};
    let nextBinaryFromDecimal: string | null = null;
    let nextDecimalFromBinary: string | null = null;
    let nextDecimalDisplay: string | null = null;
    let nextBinaryDisplay: string | null = null;
    let hint: string | undefined;

    const decimalParsed = parseDecimalInput(next.decimal, next.bits);
    if (decimalParsed.blank) {
      // leave decimal→binary empty
    } else if (decimalParsed.error || decimalParsed.value === null) {
      nextErrors.decimal = decimalParsed.error ?? 'Enter a valid decimal integer.';
    } else {
      try {
        const result = buildDecimalToBinary(decimalParsed.value, next.bits);
        nextBinaryFromDecimal = result.binary;
        nextDecimalDisplay = formatSignedInt(result.decimal);
      } catch (err) {
        nextErrors.decimal =
          err instanceof Error ? err.message : 'Unable to convert this decimal value.';
      }
    }

    const cleanedBinary = next.binary.trim().replace(/[\s_]/g, '');
    const binaryParsed = parseBinaryInput(next.binary, next.bits);
    if (binaryParsed.blank) {
      hint = binaryIncompleteMessage(next.bits, cleanedBinary.length);
      if (cleanedBinary.length > 0 && /[^01]/.test(cleanedBinary)) {
        nextErrors.binary = 'Invalid binary input. Only 0 and 1 are allowed.';
        hint = undefined;
      }
    } else if (binaryParsed.error || !binaryParsed.value) {
      nextErrors.binary = binaryParsed.error ?? 'Enter a valid binary value.';
    } else {
      try {
        const result = buildBinaryToDecimal(binaryParsed.value, next.bits);
        nextDecimalFromBinary = result.decimalDisplay;
        nextBinaryDisplay = result.binary;
      } catch (err) {
        nextErrors.binary =
          err instanceof Error ? err.message : 'Unable to convert this binary value.';
      }
    }

    setDraft(next);
    setErrors(nextErrors);
    setBinaryHint(hint);
    setBinaryFromDecimal(nextBinaryFromDecimal);
    setDecimalFromBinary(nextDecimalFromBinary);
    setDecimalInputDisplay(nextDecimalDisplay);
    setBinaryInputDisplay(nextBinaryDisplay);
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const base = { ...draft, bits: 8 as const, decimalOpen: true, binaryOpen: true };
      const examples: Record<1 | 2 | 3 | 4 | 5, BinaryDraft> = {
        1: { ...base, decimal: '5', binary: draft.binary },
        2: { ...base, decimal: '-5', binary: draft.binary },
        3: { ...base, binary: '01111111', decimal: draft.decimal },
        4: { ...base, binary: '10000000', decimal: draft.decimal },
        5: { ...base, decimal: '-1', binary: draft.binary },
      };
      evaluate(examples[id]);
    },
    [draft, evaluate]
  );

  const sharePayload = summaryText({
    bits: draft.bits,
    decimalInput: decimalInputDisplay,
    binaryFromDecimal,
    binaryInput: binaryInputDisplay,
    decimalFromBinary,
  });

  const canCopyShare = Boolean(binaryFromDecimal || decimalFromBinary);

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
            Signed two&apos;s complement · {draft.bits}-bit
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <BinaryForm
          draft={draft}
          errors={errors}
          binaryHint={binaryHint}
          decimalResult={decimalFromBinary}
          binaryResult={binaryFromDecimal}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(defaultDraft());
            setErrors({});
            setBinaryHint(undefined);
            setBinaryFromDecimal(null);
            setDecimalFromBinary(null);
            setDecimalInputDisplay(null);
            setBinaryInputDisplay(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft(draft.bits));
            setErrors({});
            setBinaryHint(undefined);
            setBinaryFromDecimal(null);
            setDecimalFromBinary(null);
            setDecimalInputDisplay(null);
            setBinaryInputDisplay(null);
            setCopied(false);
            setShared(false);
          }}
          onApplyExample={applyExample}
          onCopyBinaryToInput={
            binaryFromDecimal
              ? () => evaluate({ ...draft, binary: binaryFromDecimal, binaryOpen: true })
              : undefined
          }
          onCopyDecimalToInput={
            decimalFromBinary
              ? () => evaluate({ ...draft, decimal: decimalFromBinary, decimalOpen: true })
              : undefined
          }
        />
        <BinaryResults
          bits={draft.bits}
          binaryFromDecimal={binaryFromDecimal}
          decimalFromBinary={decimalFromBinary}
          decimalInputDisplay={decimalInputDisplay}
          binaryInputDisplay={binaryInputDisplay}
          copied={copied}
          shared={shared}
          canShare={canShare && canCopyShare}
          onCopy={() => {
            if (!canCopyShare) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!canCopyShare || typeof navigator.share !== 'function') return;
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
