'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DATA_RATE_UNIT_BY_ID,
  RATE_FIELDS,
  type DataRateUnit,
  type MbpsToGbpsFieldErrors,
} from './types';

export interface MbpsToGbpsDraft {
  texts: Record<DataRateUnit, string>;
  activeField: DataRateUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): MbpsToGbpsDraft {
  return {
    texts: { Mbps: '1000', Gbps: '1', GBps: '0.125' },
    activeField: null,
  };
}

export function emptyDraft(): MbpsToGbpsDraft {
  return {
    texts: { Mbps: '', Gbps: '', GBps: '' },
    activeField: null,
  };
}

interface MbpsToGbpsFormProps {
  draft: MbpsToGbpsDraft;
  errors: MbpsToGbpsFieldErrors;
  onDraftChange: (draft: MbpsToGbpsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function MbpsToGbpsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MbpsToGbpsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Lowercase <strong>b</strong> means bits; uppercase <strong>B</strong> means bytes. Edit any
 field: the others update from the same bit rate. <strong>1 Gbps = 1000 Mbps</strong>;{' '}
        <strong>1 GB/s = 8 Gbps = 8000 Mbps</strong>.
      </div>

      {RATE_FIELDS.map((field) => {
        const id = `mbps-gbps-${field}`;
        const error = errors[field];
        const def = DATA_RATE_UNIT_BY_ID[field];
        return (
          <div key={field} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {def.label}
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.texts[field]}
                  placeholder={field === 'Mbps' ? 'e.g. 1000' : 'e.g. 1'}
                  aria-invalid={Boolean(error)}
                  onChange={(event) =>
                    onDraftChange({
                      texts: { ...draft.texts, [field]: event.target.value },
                      activeField: field,
                    })
                  }
                />
              </div>
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
                {def.symbol}
              </span>
            </div>
            {error ? (
              <p className="text-xs text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
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
