'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  DEFAULT_COLOR,
  emptyFields,
  fieldsFromCanonical,
  formatsFromCanonical,
  parseHex,
  rgbToHex,
} from './calculation';
import { ColorForm, type ColorDraft } from './ColorForm';
import { ColorResults } from './ColorResults';
import type { CanonicalColor, ColorFieldErrors, ColorModel } from './types';
import { DEFAULT_MODEL } from './types';
import { parseColorFields } from './validation';

const ALPHA_MODELS: ReadonlySet<ColorModel> = new Set(['RGBA', 'HSLA', 'HEX']);

function defaultDraft(): ColorDraft {
  return {
    model: DEFAULT_MODEL,
    fields: fieldsFromCanonical(DEFAULT_MODEL, DEFAULT_COLOR),
  };
}

function summaryText(formats: ReturnType<typeof formatsFromCanonical>): string {
  const lines = [
    'Color Converter — Omega Calculators',
    '',
    `Selected Color: ${formats.hex}`,
    '',
    `RGB: ${formats.rgb}`,
    `RGBA: ${formats.rgba}`,
    `HEX: ${formats.hex}`,
    `HSL: ${formats.hsl}`,
    `HSV: ${formats.hsv}`,
    `CMYK: ${formats.cmyk}`,
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function ColorConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<ColorDraft>(defaultDraft);
  const [canonical, setCanonical] = React.useState<CanonicalColor | null>(DEFAULT_COLOR);
  const [errors, setErrors] = React.useState<ColorFieldErrors>({});
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const alphaRef = React.useRef(DEFAULT_COLOR.a);
  const lastValidRef = React.useRef<CanonicalColor>(DEFAULT_COLOR);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const formats = canonical ? formatsFromCanonical(canonical) : null;
  const pickerSource = canonical ?? lastValidRef.current;
  const pickerHex = rgbToHex(pickerSource.r, pickerSource.g, pickerSource.b).toLowerCase();
  const alphaOmitted =
    Boolean(canonical) &&
    canonical!.a < 1 &&
    !ALPHA_MODELS.has(draft.model);

  const applyFields = React.useCallback((model: ColorModel, fields: Record<string, string>) => {
    const parsed = parseColorFields(model, fields, alphaRef.current);
    setDraft({ model, fields });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      setCanonical(null);
      return;
    }
    alphaRef.current = parsed.color.a;
    lastValidRef.current = parsed.color;
    setCanonical(parsed.color);
    setErrors({});
  }, []);

  const onModelChange = (model: ColorModel) => {
    const source = canonical ?? lastValidRef.current;
    const fields = fieldsFromCanonical(model, source);
    setDraft({ model, fields });
    setCanonical(source);
    setErrors({});
  };

  const onFieldChange = (key: string, value: string) => {
    applyFields(draft.model, { ...draft.fields, [key]: value });
  };

  const onPickerChange = (hex: string) => {
    const parsed = parseHex(hex);
    if (!parsed) return;
    const next: CanonicalColor = {
      r: parsed.r,
      g: parsed.g,
      b: parsed.b,
      a: alphaRef.current,
    };
    alphaRef.current = next.a;
    lastValidRef.current = next;
    setCanonical(next);
    setDraft({
      model: draft.model,
      fields: fieldsFromCanonical(draft.model, next),
    });
    setErrors({});
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      alphaRef.current = DEFAULT_COLOR.a;
      lastValidRef.current = DEFAULT_COLOR;
      setDraft(defaultDraft());
      setCanonical(DEFAULT_COLOR);
    } else {
      setDraft({ model: draft.model, fields: emptyFields(draft.model) });
      setCanonical(null);
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
          <p className="text-xs font-normal text-muted-foreground">
            HEX · RGB · HSL · HSV · CMYK · alpha
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ColorForm
          draft={draft}
          errors={errors}
          pickerHex={pickerHex}
          alphaOmitted={alphaOmitted}
          onModelChange={onModelChange}
          onFieldChange={onFieldChange}
          onPickerChange={onPickerChange}
          onSubmit={(event) => {
            event.preventDefault();
            applyFields(draft.model, draft.fields);
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <ColorResults
            color={canonical}
            formats={formats}
            shared={shared}
            canShare={canShare}
            onShare={() => {
              if (!formats) return;
              const payload = summaryText(formats);
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
        </ColorForm>
      </div>
    </section>
  );
}
