'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { MATERIALS } from '@/tools/electrical/conductor';
import type { ConductorChoice, TwelveVoltResult } from './calculation';

function num(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString('en-US', { maximumFractionDigits: digits });
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-accent">{value}</p>
    </div>
  );
}

function SizeBlock({ title, choice }: { title: string; choice: ConductorChoice | null }) {
  if (!choice) {
    return (
      <p className="text-sm text-muted-foreground">
        {title}: none of the listed standard sizes is large enough for this voltage-drop area.
      </p>
    );
  }
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm">
      <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 text-base font-semibold text-accent">{choice.label}</p>
      <p className="mt-1 text-muted-foreground">
        Nominal area {num(choice.areaMm2, 3)} mm². Equivalent solid diameter {num(choice.diameterMm, 3)} mm.
      </p>
      {choice.dropExceedsSource ? (
        <p className="mt-1 text-xs text-rose-700">
          This size still drops more than the source voltage. The load voltage is not a usable operating point.
        </p>
      ) : (
        <p className="mt-1 text-muted-foreground">
          Drop {num(choice.dropVolts, 3)} V ({num(choice.dropPercent, 2)}%). Load voltage {num(choice.loadVolts, 3)} V.
          Loop resistance {num(choice.loopResistanceOhm, 4)} Ω. Wiring loss {num(choice.powerLossWatts, 2)} W.
        </p>
      )}
    </div>
  );
}

export function TwelveVoltWireResults({
  result,
  copied,
  onCopy,
}: {
  result: TwelveVoltResult | null;
  copied: boolean;
  onCopy: () => void;
}) {
  if (!result) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">Review highlighted inputs</p>
        <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
          Correct the fields above to estimate the voltage-drop area.
        </p>
      </div>
    );
  }

  const material = MATERIALS[result.material].label;

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">Estimated minimum size by voltage drop</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold tracking-tight text-accent tabular-nums sm:text-4xl">
                {num(result.minimumAreaMm2, 3)}
              </span>
              <span className="text-base font-semibold text-primary">mm²</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Ampacity is not verified. This is a calculated voltage-drop area, not a code-compliant installation
              recommendation.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="h-8 gap-1.5 rounded-lg border-primary/30 bg-white/80 px-2.5 text-xs font-medium text-accent shadow-xs hover:bg-white hover:text-primary"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                Copy results
              </>
            )}
          </Button>
        </div>
      </div>

      {result.zeroLength ? (
        <p className="text-xs text-muted-foreground">
          One-way length is zero, so the voltage-drop area is zero. Length does not choose a wire in that case.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Metric label="Permitted drop" value={`${num(result.maxDropVolts, 3)} V`} />
        <Metric label="Solid diameter of that area" value={`${num(result.minimumDiameterMm, 3)} mm`} />
        <Metric label="Loop resistance" value={`${num(result.minimumLoopResistanceOhm, 4)} Ω`} />
        <Metric label="Wiring power loss" value={`${num(result.minimumPowerLossWatts, 2)} W`} />
        <Metric label="Material" value={material} />
        <Metric label="Current" value={`${num(result.current, 3)} A`} />
        <Metric label="One-way length" value={`${num(result.oneWayMeters, 3)} m`} />
        <Metric label="Conductor temperature" value={`${num(result.tempC, 1)}°C`} />
        <Metric label="Drop limit" value={`${num(result.maxDropPercent, 2)}%`} />
      </div>

      <SizeBlock title="Smallest listed metric size at or above that area" choice={result.metric} />
      <SizeBlock title="Smallest listed AWG at or above that area" choice={result.awg} />
      <p className="text-xs leading-relaxed text-muted-foreground">
        AWG and mm² sizes are chosen separately and are not exact equivalents. Diameter is for a solid round
        conductor of that metal area, √(4A/π), not the outside diameter of insulated or stranded cable. A conductor
        that meets this area can still be too small for the current, the insulation, or the protective device.
      </p>
    </div>
  );
}
