'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { formatRgbCss, hexToRgb, rgbToHex } from './calculation';
import {
  defaultDraft,
  emptyDraft,
  RgbToHexForm,
  type RgbToHexDraft,
} from './RgbToHexForm';
import { RgbToHexResults } from './RgbToHexResults';
import type { ConversionDirection, RGB, RgbHexFieldErrors } from './types';
import { DEFAULT_HEX, DEFAULT_RGB } from './types';
import { parseHexField, parseRgbFields } from './validation';

function summaryText(rgb: RGB, hex: string): string {
  const lines = [
    'RGB to HEX Converter — Omega Calculators',
    '',
    `RGB: ${formatRgbCss(rgb)}`,
    `HEX: ${hex}`,
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function RgbToHexConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<RgbToHexDraft>(defaultDraft);
  const [rgb, setRgb] = React.useState<RGB | null>(DEFAULT_RGB);
  const [hex, setHex] = React.useState<string | null>(DEFAULT_HEX);
  const [errors, setErrors] = React.useState<RgbHexFieldErrors>({});
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const lastValidRef = React.useRef<{ rgb: RGB; hex: string }>({
    rgb: DEFAULT_RGB,
    hex: DEFAULT_HEX,
  });

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const pickerSource = rgb ?? lastValidRef.current.rgb;
  const pickerHex = rgbToHex(pickerSource.r, pickerSource.g, pickerSource.b).toLowerCase();

  const applyDraft = React.useCallback((next: RgbToHexDraft) => {
    if (next.direction === 'rgb-to-hex') {
      const parsed = parseRgbFields({ r: next.r, g: next.g, b: next.b });
      if (!parsed.ok) {
        setDraft(next);
        setErrors(parsed.errors);
        setRgb(null);
        setHex(null);
        return;
      }
      lastValidRef.current = { rgb: parsed.rgb, hex: parsed.hex };
      setDraft({ ...next, hex: parsed.hex });
      setRgb(parsed.rgb);
      setHex(parsed.hex);
      setErrors({});
      return;
    }

    const parsed = parseHexField(next.hex);
    if (!parsed.ok) {
      setDraft(next);
      setErrors(parsed.errors);
      setRgb(null);
      setHex(null);
      return;
    }
    lastValidRef.current = { rgb: parsed.rgb, hex: parsed.hex };
    setDraft({
      ...next,
      r: String(parsed.rgb.r),
      g: String(parsed.rgb.g),
      b: String(parsed.rgb.b),
    });
    setRgb(parsed.rgb);
    setHex(parsed.hex);
    setErrors({});
  }, []);

  const onDirectionChange = (direction: ConversionDirection) => {
    const source = rgb ?? lastValidRef.current.rgb;
    const nextHex = rgbToHex(source.r, source.g, source.b);
    setDraft({
      direction,
      r: String(source.r),
      g: String(source.g),
      b: String(source.b),
      hex: nextHex,
    });
    setRgb(source);
    setHex(nextHex);
    setErrors({});
  };

  const onFieldChange = (field: 'r' | 'g' | 'b' | 'hex', value: string) => {
    applyDraft({ ...draft, [field]: value });
  };

  const onPickerChange = (raw: string) => {
    try {
      const parsed = hexToRgb(raw);
      const nextHex = rgbToHex(parsed.r, parsed.g, parsed.b);
      lastValidRef.current = { rgb: parsed, hex: nextHex };
      setRgb(parsed);
      setHex(nextHex);
      setDraft({
        ...draft,
        r: String(parsed.r),
        g: String(parsed.g),
        b: String(parsed.b),
        hex: nextHex,
      });
      setErrors({});
    } catch {
      // ignore invalid picker values
    }
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      lastValidRef.current = { rgb: DEFAULT_RGB, hex: DEFAULT_HEX };
      setDraft(defaultDraft());
      setRgb(DEFAULT_RGB);
      setHex(DEFAULT_HEX);
    } else {
      setDraft(emptyDraft(draft.direction));
      setRgb(null);
      setHex(null);
    }
    setErrors({});
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
          <p className="text-xs font-normal text-muted-foreground">RGB ↔ HEX</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <RgbToHexForm
          draft={draft}
          errors={errors}
          pickerHex={pickerHex}
          onDirectionChange={onDirectionChange}
          onFieldChange={onFieldChange}
          onPickerChange={onPickerChange}
          onSubmit={(event) => {
            event.preventDefault();
            applyDraft(draft);
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <RgbToHexResults
            rgb={rgb}
            hex={hex}
            direction={draft.direction}
            shared={shared}
            canShare={canShare}
            onShare={() => {
              if (!rgb || !hex) return;
              const payload = summaryText(rgb, hex);
              const markShared = () => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              };
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text: payload,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(markShared)
                  .catch(() => {
                    void copyTextToClipboard(payload).then((ok) => {
                      if (ok) markShared();
                    });
                  });
                return;
              }
              void copyTextToClipboard(payload).then((ok) => {
                if (ok) markShared();
              });
            }}
          />
        </RgbToHexForm>
      </div>
    </section>
  );
}
