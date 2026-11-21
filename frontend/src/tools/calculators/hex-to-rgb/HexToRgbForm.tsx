'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DIRECTION_LABELS,
  type ConversionDirection,
  type HexRgbFieldErrors,
} from './types';

export interface HexToRgbDraft {
  direction: ConversionDirection;
  allowShorthand: boolean;
  r: string;
  g: string;
  b: string;
  hex: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): HexToRgbDraft {
  return {
    direction: 'hex-to-rgb',
    allowShorthand: false,
    r: '255',
    g: '131',
    b: '0',
    hex: '#FF8300',
  };
}

export function emptyDraft(
  direction: ConversionDirection,
  allowShorthand: boolean,
): HexToRgbDraft {
  return { direction, allowShorthand, r: '', g: '', b: '', hex: '' };
}

interface HexToRgbFormProps {
  draft: HexToRgbDraft;
  errors: HexRgbFieldErrors;
  pickerHex: string;
  onDirectionChange: (direction: ConversionDirection) => void;
  onShorthandChange: (allow: boolean) => void;
  onFieldChange: (field: 'r' | 'g' | 'b' | 'hex', value: string) => void;
  onPickerChange: (hex: string) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function HexToRgbForm({
  draft,
  errors,
  pickerHex,
  onDirectionChange,
  onShorthandChange,
  onFieldChange,
  onPickerChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: HexToRgbFormProps) {
  const hexMode = draft.direction === 'hex-to-rgb';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset className="space-y-2">
        <legend className={labelClass}>Conversion direction</legend>
        <div className="space-y-2 rounded-xl border border-border bg-muted/30 px-3.5 py-3">
          {(['hex-to-rgb', 'rgb-to-hex'] as const).map((direction) => (
            <label
              key={direction}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
            >
              <input
                type="radio"
                name="hex-rgb-direction"
                className="h-4 w-4 accent-primary"
                checked={draft.direction === direction}
                onChange={() => onDirectionChange(direction)}
              />
              <span>{DIRECTION_LABELS[direction]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {hexMode ? (
        <>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-accent">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-primary"
              checked={draft.allowShorthand}
              onChange={(event) => onShorthandChange(event.target.checked)}
            />
            <span>
              <span className="font-medium">Use shorthand HEX notation</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                When enabled, three-digit codes such as <code className="font-mono">#F80</code>{' '}
                expand to six digits. Six-digit HEX always works.
              </span>
            </span>
          </label>

          <div className="space-y-1.5">
            <label htmlFor="hex-rgb-hex" className={labelClass}>
              Hex (e.g., {draft.allowShorthand ? 'F80 or FF8300' : 'FF8300'})
            </label>
            <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="hex-rgb-hex"
                autoComplete="off"
                spellCheck={false}
                className={inputClass}
                value={draft.hex}
                placeholder={draft.allowShorthand ? '#F80 or #FF8300' : '#FF8300'}
                aria-invalid={Boolean(errors.hex)}
                aria-describedby={errors.hex ? 'hex-rgb-hex-error' : 'hex-rgb-hex-hint'}
                onChange={(event) => onFieldChange('hex', event.target.value)}
              />
            </div>
            {errors.hex ? (
              <p id="hex-rgb-hex-error" className="text-xs text-red-600" role="alert">
                {errors.hex}
              </p>
            ) : (
              <p id="hex-rgb-hex-hint" className="text-xs text-muted-foreground">
                Optional <code className="font-mono">#</code> prefix. Uppercase or lowercase.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(
            [
              { key: 'r' as const, label: 'R; Red' },
              { key: 'g' as const, label: 'G; Green' },
              { key: 'b' as const, label: 'B; Blue' },
            ] as const
          ).map((field) => {
            const id = `hex-rgb-${field.key}`;
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
      )}

      <div className="space-y-1.5">
        <label htmlFor="hex-rgb-picker" className={labelClass}>
          Color picker
        </label>
        <div className="flex items-center gap-3">
          <input
            id="hex-rgb-picker"
            type="color"
            value={pickerHex}
            onChange={(event) => onPickerChange(event.target.value)}
            className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-white p-1"
            aria-label="Pick a color"
          />
          <p className="text-xs text-muted-foreground">Updates HEX and RGB together.</p>
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
