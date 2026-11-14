'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatPowerNumber } from './calculation';
import type { SpeedUnit, TorqueToHpResult, TorqueUnit } from './types';

function torqueUnitLabel(unit: TorqueUnit): string {
  const map: Record<TorqueUnit, string> = {
    Nm: 'N·m',
    kNm: 'kN·m',
    Ncm: 'N·cm',
    ftlbf: 'ft·lbf',
    inlbf: 'in·lbf',
    kgfm: 'kgf·m',
    kgfcm: 'kgf·cm',
  };
  return map[unit];
}

function speedUnitLabel(unit: SpeedUnit): string {
  const map: Record<SpeedUnit, string> = {
    rpm: 'rpm',
    revs: 'rev/s',
    rads: 'rad/s',
    degs: '°/s',
  };
  return map[unit];
}

interface TorqueToHpResultsProps {
  result: TorqueToHpResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function TorqueToHpResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: TorqueToHpResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter two independent values among torque, speed, and power (or horsepower) to solve.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter torque and speed (or another valid pair).
      </p>
    );
  }

  const hpLabel = result.hpUnit === 'PS' ? 'PS' : 'hp (mech.)';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Shaft power
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatPowerNumber(result.horsepowerDisplay)} {hpLabel}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatPowerNumber(result.torqueDisplay)} {torqueUnitLabel(result.torqueUnit)} ·{' '}
          {formatPowerNumber(result.speedDisplay)} {speedUnitLabel(result.speedUnit)} ·{' '}
          {formatPowerNumber(result.powerDisplay)} {result.powerUnit}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          P = τ × ω · {formatPowerNumber(result.powerW)} W · ω ={' '}
          {formatPowerNumber(result.angularSpeedRadS)} rad/s
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        {canShare ? (
          <Button type="button" variant="outline" className="h-10" onClick={onShare}>
            {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
            {shared ? 'Shared' : 'Share result'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
