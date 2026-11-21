'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DIRECTION_LABELS,
  type ConversionDirection,
  type RgbHexFieldErrors,
} from './types';

export interface RgbToHexDraft {
  direction: ConversionDirection;
  r: string;
  g: string;
  b: string;
  hex: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): RgbToHexDraft {
  return { direction: 'rgb-to-hex', r: '255', g: '100', b: '50', hex: '#FF6432' };
}

export function emptyDraft(direction: ConversionDirection): RgbToHexDraft {
  return { direction, r: '', g: '', b: '', hex: '' };
}

interface RgbToHexFormProps {
  draft: RgbToHexDraft;
  errors: RgbHexFieldErrors;
  pickerHex: string;
  onDirectionChange: (direction: ConversionDirection) => void;
  onFieldChange: (field: 'r' | 'g' | 'b' | 'hex', value: string) => void;
  onPickerChange: (hex: string) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function RgbToHexForm({
  draft,
  errors,
  pickerHex,
  onDirectionChange,
  onFieldChange,
  onPickerChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: RgbToHexFormProps) {
  const rgbMode = draft.direction === 'rgb-to-hex';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset className="space-y-2">
        <legend className={labelClass}>Conversion direction</legend>
        <div className="space-y-2 rounded-xl border border-border bg-muted/30 px-3.5 py-3">
          {(['rgb-to-hex', 'hex-to-rgb'] as const).map((direction) => (
            <label
              key={direction}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
            >
              <input
                type="radio"
                name="rgb-hex-direction"
                className="h-4 w-4 accent-primary"
                checked={draft.direction === direction}
                onChange={() => onDirectionChange(direction)}
              />
              <span>{DIRECTION_LABELS[direction]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {rgbMode ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(
            [
              { key: 'r' as const, label: 'R; Red' },
              { key: 'g' as const, label: 'G; Green' },
              { key: 'b' as const, label: 'B; Blue' },
            ] as const
          ).map((field) => {
            const id = `rgb-hex-${field.key}`;
            const error = errors[field.key];
            return (
              <div key={field.key} className="space-y-1.5">
                <label htmlFor={id} className={labelClass}>
                  {field.label}
                </label>
                <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id={id}
                    inputMode="numeric"
                    autoComplete="off"
                    className={inputClass}
                    value={draft[field.key]}
                    placeholder="0–255"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-error` : undefined}
                    onChange={(event) => onFieldChange(field.key, event.target.value)}
                  />
                </div>
                {error ? (
                  <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1.5">
          <label htmlFor="rgb-hex-hex" className={labelClass}>
            HEX color code
          </label>
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="rgb-hex-hex"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.hex}
              placeholder="#FF6432"
              aria-invalid={Boolean(errors.hex)}
              aria-describedby={errors.hex ? 'rgb-hex-hex-error' : undefined}
              onChange={(event) => onFieldChange('hex', event.target.value)}
            />
          </div>
          {errors.hex ? (
            <p id="rgb-hex-hex-error" className="text-xs text-red-600" role="alert">
              {errors.hex}
            </p>
          ) : null}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="rgb-hex-picker" className={labelClass}>
          Color picker
        </label>
        <div className="flex items-center gap-3">
          <input
            id="rgb-hex-picker"
            type="color"
            value={pickerHex}
            onChange={(event) => onPickerChange(event.target.value)}
            className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-white p-1"
            aria-label="Pick a color"
          />
          <p className="text-xs text-muted-foreground">
            Updates both RGB channels and the HEX code.
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
