'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildBinaryConversion, buildHexToBinary } from './calculation';
import {
  BinaryToHexForm,
  defaultDraft,
  emptyDraft,
  type BinaryToHexDraft,
} from './BinaryToHexForm';
import { BinaryToHexResults } from './BinaryToHexResults';
import type {
  BinaryConversionResult,
  BinaryHexFieldErrors,
  HexToBinaryResult,
} from './types';
import { parseBinaryInput, parseHexInput } from './validation';

function summaryText(
  forward: BinaryConversionResult | null,
  reverse: HexToBinaryResult | null
): string {
  const lines = ['Binary to Hexadecimal Converter', 'Omega Calculators', ''];
  if (forward) {
    lines.push(`Binary: ${forward.binaryNormalized}`);
    lines.push(`Hexadecimal: ${forward.hexadecimal}`);
    lines.push(`Decimal: ${forward.decimal}`);
    lines.push(`Octal: ${forward.octal}`);
    lines.push('');
  }
  if (reverse) {
    lines.push(`Hexadecimal: ${reverse.hexadecimalNormalized}`);
    lines.push(`Binary: ${reverse.binary}`);
    lines.push('');
  }
  if (typeof window !== 'undefined') {
    lines.push(`Explore: ${window.location.href}`);
  }
  return lines.join('\n').trimEnd();
}

export function BinaryToHexConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<BinaryToHexDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<BinaryHexFieldErrors>({});
  const [forward, setForward] = React.useState<BinaryConversionResult | null>(null);
  const [reverse, setReverse] = React.useState<HexToBinaryResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: BinaryToHexDraft) => {
    const nextErrors: BinaryHexFieldErrors = {};
    let nextForward: BinaryConversionResult | null = null;
    let nextReverse: HexToBinaryResult | null = null;

    const binaryParsed = parseBinaryInput(next.binary);
    if (binaryParsed.blank) {
      // empty forward
    } else if (binaryParsed.error || !binaryParsed.value) {
      nextErrors.binary =
        binaryParsed.error ??
        'Please enter a valid binary number containing only 0 and 1.';
    } else {
      try {
        nextForward = buildBinaryConversion(binaryParsed.value);
      } catch (err) {
        nextErrors.binary =
          err instanceof Error
            ? err.message
            : 'Please enter a valid binary number containing only 0 and 1.';
      }
    }

    if (next.reverseOpen) {
      const hexParsed = parseHexInput(next.hex);
      if (hexParsed.blank) {
        // empty reverse
      } else if (hexParsed.error || !hexParsed.value) {
        nextErrors.hex =
          hexParsed.error ?? 'Please enter a valid hexadecimal number (0–9, A–F).';
      } else {
        try {
          nextReverse = buildHexToBinary(hexParsed.value);
        } catch (err) {
          nextErrors.hex =
            err instanceof Error
              ? err.message
              : 'Please enter a valid hexadecimal number (0–9, A–F).';
        }
      }
    }

    setDraft(next);
    setErrors(nextErrors);
    setForward(nextForward);
    setReverse(nextReverse);
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      if (id === 5) {
        evaluate({
          ...draft,
          hex: '2AF',
          reverseOpen: true,
          stepsOpen: false,
        });
        return;
      }
      const binaries: Record<1 | 2 | 3 | 4, string> = {
        1: '10110110',
        2: '110101',
        3: '11111111',
        4: '110101101',
      };
      evaluate({
        ...draft,
        binary: binaries[id],
        stepsOpen: true,
      });
    },
    [draft, evaluate]
  );

  const sharePayload = summaryText(forward, reverse);
  const canCopyShare = Boolean(forward || reverse);

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
            Base 2 → base 16 · 4-bit groups
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <BinaryToHexForm
          draft={draft}
          errors={errors}
          forward={forward}
          reverse={reverse}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(defaultDraft());
            setErrors({});
            setForward(null);
            setReverse(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setErrors({});
            setForward(null);
            setReverse(null);
            setCopied(false);
            setShared(false);
          }}
          onApplyExample={applyExample}
        >
          <BinaryToHexResults
            forward={forward}
            reverse={reverse}
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
                  void copyTextToClipboard(sharePayload).then((ok) => {
                    if (!ok) return;
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  });
                });
            }}
          />
        </BinaryToHexForm>
      </div>
    </section>
  );
}
