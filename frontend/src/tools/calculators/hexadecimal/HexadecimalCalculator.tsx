'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildBinaryToHex, buildDecimalToHex, buildHexToBoth } from './calculation';
import {
  HexadecimalForm,
  defaultDraft,
  emptyDraft,
  type HexadecimalDraft,
} from './HexadecimalForm';
import { HexadecimalResults } from './HexadecimalResults';
import type {
  BinaryToHexResult,
  DecimalToHexResult,
  HexFieldErrors,
  HexToBothResult,
} from './types';
import { parseBinaryInput, parseDecimalInput, parseHexInput } from './validation';

function summaryText(args: {
  decimalResult: DecimalToHexResult | null;
  binaryResult: BinaryToHexResult | null;
  hexResult: HexToBothResult | null;
}): string {
  const lines = ['Hexadecimal Converter | Omega Calculators', ''];
  if (args.decimalResult) {
    lines.push('Conversion: Decimal to Hexadecimal');
    lines.push(`Decimal: ${args.decimalResult.decimal}`);
    lines.push(`Hexadecimal: ${args.decimalResult.hexadecimal}`);
    lines.push('');
    lines.push(`${args.decimalResult.decimal}₁₀ = ${args.decimalResult.hexadecimal}₁₆`);
    lines.push('');
  }
  if (args.binaryResult) {
    lines.push('Conversion: Binary to Hexadecimal');
    lines.push(`Binary: ${args.binaryResult.binaryNormalized}`);
    lines.push(`Hexadecimal: ${args.binaryResult.hexadecimal}`);
    lines.push('');
    lines.push(
      `${args.binaryResult.binaryNormalized}₂ = ${args.binaryResult.hexadecimal}₁₆`
    );
    lines.push('');
  }
  if (args.hexResult) {
    lines.push('Conversion: Hexadecimal to Decimal/Binary');
    lines.push(`Hexadecimal: ${args.hexResult.hexadecimalNormalized}`);
    lines.push(`Decimal: ${args.hexResult.decimal}`);
    lines.push(`Binary: ${args.hexResult.binary}`);
    lines.push('');
    lines.push(
      `${args.hexResult.hexadecimalNormalized}₁₆ = ${args.hexResult.decimal}₁₀ = ${args.hexResult.binary}₂`
    );
  }
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n').trimEnd();
}

export function HexadecimalConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<HexadecimalDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<HexFieldErrors>({});
  const [decimalResult, setDecimalResult] = React.useState<DecimalToHexResult | null>(null);
  const [binaryResult, setBinaryResult] = React.useState<BinaryToHexResult | null>(null);
  const [hexResult, setHexResult] = React.useState<HexToBothResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: HexadecimalDraft) => {
    const nextErrors: HexFieldErrors = {};
    let nextDecimal: DecimalToHexResult | null = null;
    let nextBinary: BinaryToHexResult | null = null;
    let nextHex: HexToBothResult | null = null;

    const decimalParsed = parseDecimalInput(next.decimal);
    if (decimalParsed.blank) {
      // leave empty
    } else if (decimalParsed.error || decimalParsed.value === null) {
      nextErrors.decimal = decimalParsed.error ?? 'Enter a valid non-negative decimal integer.';
    } else {
      try {
        nextDecimal = buildDecimalToHex(decimalParsed.value);
      } catch (err) {
        nextErrors.decimal =
          err instanceof Error ? err.message : 'Unable to convert this decimal value.';
      }
    }

    const binaryParsed = parseBinaryInput(next.binary);
    if (binaryParsed.blank) {
      // leave empty
    } else if (binaryParsed.error || binaryParsed.value === null) {
      nextErrors.binary =
        binaryParsed.error ?? 'Enter a valid binary number containing only 0 and 1.';
    } else {
      try {
        nextBinary = buildBinaryToHex(binaryParsed.value);
      } catch (err) {
        nextErrors.binary =
          err instanceof Error ? err.message : 'Unable to convert this binary value.';
      }
    }

    const hexParsed = parseHexInput(next.hex);
    if (hexParsed.blank) {
      // leave empty
    } else if (hexParsed.error || hexParsed.value === null) {
      nextErrors.hex =
        hexParsed.error ??
        'Enter a valid hexadecimal number containing digits 0–9 and letters A–F.';
    } else {
      try {
        nextHex = buildHexToBoth(hexParsed.value);
      } catch (err) {
        nextErrors.hex =
          err instanceof Error ? err.message : 'Unable to convert this hexadecimal value.';
      }
    }

    setDraft(next);
    setErrors(nextErrors);
    setDecimalResult(nextDecimal);
    setBinaryResult(nextBinary);
    setHexResult(nextHex);
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const base = {
        ...draft,
        decimalOpen: true,
        binaryOpen: true,
        hexOpen: true,
        decimalStepsOpen: true,
        binaryStepsOpen: true,
        hexStepsOpen: true,
      };
      const examples: Record<1 | 2 | 3 | 4 | 5, HexadecimalDraft> = {
        1: { ...base, decimal: '255' },
        2: { ...base, binary: '11010110' },
        3: { ...base, hex: '1A3F' },
        4: { ...base, decimal: '100' },
        5: { ...base, hex: 'FF' },
      };
      evaluate(examples[id]);
    },
    [draft, evaluate]
  );

  const sharePayload = summaryText({ decimalResult, binaryResult, hexResult });
  const canCopyShare = Boolean(decimalResult || binaryResult || hexResult);

  const clearAll = () => {
    setDraft(emptyDraft());
    setErrors({});
    setDecimalResult(null);
    setBinaryResult(null);
    setHexResult(null);
    setCopied(false);
    setShared(false);
  };

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
            Decimal · binary · hexadecimal
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <HexadecimalForm
          draft={draft}
          errors={errors}
          decimalResult={decimalResult}
          binaryResult={binaryResult}
          hexResult={hexResult}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={clearAll}
          onReset={clearAll}
          onApplyExample={applyExample}
        >
          <HexadecimalResults
            decimalResult={decimalResult}
            binaryResult={binaryResult}
            hexResult={hexResult}
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
        </HexadecimalForm>
      </div>
    </section>
  );
}
