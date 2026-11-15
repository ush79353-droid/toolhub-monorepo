'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  COLOR_MODEL_OPTIONS,
  type ColorFieldErrors,
  type ColorModel,
} from './types';

export interface ColorDraft {
  model: ColorModel;
  fields: Record<string, string>;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface FieldSpec {
  key: string;
  label: string;
  hint?: string;
  inputMode?: 'decimal' | 'text';
  placeholder?: string;
}

function fieldsForModel(model: ColorModel): FieldSpec[] {
  switch (model) {
    case 'HEX':
      return [{ key: 'hex', label: 'HEX color code', placeholder: '#FF6432', inputMode: 'text' }];
    case 'RGB':
      return [
        { key: 'r', label: 'Red (R)', placeholder: '0–255' },
        { key: 'g', label: 'Green (G)', placeholder: '0–255' },
        { key: 'b', label: 'Blue (B)', placeholder: '0–255' },
      ];
    case 'RGBA':
      return [
        { key: 'r', label: 'Red', placeholder: '0–255' },
        { key: 'g', label: 'Green', placeholder: '0–255' },
        { key: 'b', label: 'Blue', placeholder: '0–255' },
        { key: 'a', label: 'Alpha', placeholder: '0–1', hint: '0 = transparent, 1 = opaque' },
      ];
    case 'HSL':
      return [
        { key: 'h', label: 'Hue (°)', placeholder: '0–360' },
        { key: 's', label: 'Saturation (%)', placeholder: '0–100' },
        { key: 'l', label: 'Lightness (%)', placeholder: '0–100' },
      ];
    case 'HSLA':
      return [
        { key: 'h', label: 'Hue (°)', placeholder: '0–360' },
        { key: 's', label: 'Saturation (%)', placeholder: '0–100' },
        { key: 'l', label: 'Lightness (%)', placeholder: '0–100' },
        { key: 'a', label: 'Alpha', placeholder: '0–1' },
      ];
    case 'HSV':
      return [
        { key: 'h', label: 'Hue (°)', placeholder: '0–360' },
        { key: 's', label: 'Saturation (%)', placeholder: '0–100' },
        { key: 'v', label: 'Value (%)', placeholder: '0–100' },
      ];
    case 'CMYK':
      return [
        { key: 'c', label: 'Cyan (%)', placeholder: '0–100' },
        { key: 'm', label: 'Magenta (%)', placeholder: '0–100' },
        { key: 'y', label: 'Yellow (%)', placeholder: '0–100' },
        { key: 'k', label: 'Black (%)', placeholder: '0–100' },
      ];
    default:
      return [];
  }
}

interface ColorFormProps {
  draft: ColorDraft;
  errors: ColorFieldErrors;
  pickerHex: string;
  alphaOmitted: boolean;
  onModelChange: (model: ColorModel) => void;
  onFieldChange: (key: string, value: string) => void;
  onPickerChange: (hex: string) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function ColorForm({
  draft,
  errors,
  pickerHex,
  alphaOmitted,
  onModelChange,
  onFieldChange,
  onPickerChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: ColorFormProps) {
  const specs = fieldsForModel(draft.model);
  const gridCols =
    specs.length >= 4
      ? 'sm:grid-cols-2'
      : specs.length === 3
        ? 'sm:grid-cols-3'
        : 'sm:grid-cols-1';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="color-model" className={labelClass}>
          Choose a color encoding to input
        </label>
        <select
          id="color-model"
          className={selectClass}
          value={draft.model}
          onChange={(event) => onModelChange(event.target.value as ColorModel)}
        >
          {COLOR_MODEL_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-3">
        <legend className={labelClass}>{draft.model}</legend>
        <div className={`grid grid-cols-1 gap-3 ${gridCols}`}>
          {specs.map((spec) => {
            const id = `color-${spec.key}`;
            const error = errors[spec.key];
            return (
              <div key={spec.key} className="space-y-1.5">
                <label htmlFor={id} className={labelClass}>
                  {spec.label}
                </label>
                <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id={id}
                    inputMode={spec.inputMode ?? 'decimal'}
                    autoComplete="off"
                    spellCheck={false}
                    className={inputClass}
                    value={draft.fields[spec.key] ?? ''}
                    placeholder={spec.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-error` : spec.hint ? `${id}-hint` : undefined}
                    onChange={(event) => onFieldChange(spec.key, event.target.value)}
                  />
                </div>
                {spec.hint && !error ? (
                  <p id={`${id}-hint`} className="text-xs text-muted-foreground">
                    {spec.hint}
                  </p>
                ) : null}
                {error ? (
                  <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
        {alphaOmitted ? (
          <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            The selected encoding does not include alpha. Transparency is kept in the preview and
            alpha-capable outputs (RGBA, HSLA, HEX with alpha).
          </p>
        ) : null}
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="color-picker" className={labelClass}>
          Color picker
        </label>
        <div className="flex items-center gap-3">
          <input
            id="color-picker"
            type="color"
            value={pickerHex}
            onChange={(event) => onPickerChange(event.target.value)}
            className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-white p-1"
            aria-label="Pick a color"
          />
          <p className="text-xs text-muted-foreground">
            Native picker updates RGB channels. Alpha is preserved from the previous value.
          </p>
        </div>
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Convert
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
