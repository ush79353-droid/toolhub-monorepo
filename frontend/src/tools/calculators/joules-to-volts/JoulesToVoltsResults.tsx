'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CHARGE_UNIT_SYMBOLS,
  ENERGY_UNIT_SYMBOLS,
  VOLTAGE_UNIT_SYMBOLS,
  type ChargeUnit,
  type EnergyUnit,
  type SolveFor,
  type VoltageUnit,
} from './types';

interface JoulesToVoltsResultsProps {
  hasResult: boolean;
  solveFor: SolveFor;
  energyDisplay: string;
  energyUnit: EnergyUnit;
  chargeDisplay: string;
  chargeUnit: ChargeUnit;
  voltageDisplay: string;
  voltageUnit: VoltageUnit;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function JoulesToVoltsResults({
  hasResult,
  solveFor,
  energyDisplay,
  energyUnit,
  chargeDisplay,
  chargeUnit,
  voltageDisplay,
  voltageUnit,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: JoulesToVoltsResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (!hasResult) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Choose a calculation direction and enter the two known quantities. Voltage requires both
        energy and charge (V = E / Q).
      </p>
    );
  }

  const formula =
    solveFor === 'voltage' ? 'V = E / Q' : solveFor === 'energy' ? 'E = V × Q' : 'Q = E / V';

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Result · {formula}
        </p>
        <ul className="mt-3 space-y-1.5 font-mono text-sm tabular-nums text-accent">
          <li>
            Energy:{' '}
            <span className="font-semibold">
              {energyDisplay} {ENERGY_UNIT_SYMBOLS[energyUnit]}
            </span>
          </li>
          <li>
            Charge:{' '}
            <span className="font-semibold">
              {chargeDisplay} {CHARGE_UNIT_SYMBOLS[chargeUnit]}
            </span>
          </li>
          <li>
            Voltage:{' '}
            <span className="font-semibold">
              {voltageDisplay} {VOLTAGE_UNIT_SYMBOLS[voltageUnit]}
            </span>
          </li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          1 V = 1 J/C. Sign of voltage depends on the chosen reference direction.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        <Button type="button" variant="outline" className="h-10" onClick={onShare}>
          {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
          {shared ? (canShare ? 'Shared' : 'Copied') : 'Share result'}
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        <span>Did we solve your problem today?</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFeedback('yes')}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
              feedback === 'yes'
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => setFeedback('no')}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
              feedback === 'no'
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsDown className="h-3 w-3" />
            <span>No</span>
          </button>
        </div>
      </div>
    </div>
  );
}
