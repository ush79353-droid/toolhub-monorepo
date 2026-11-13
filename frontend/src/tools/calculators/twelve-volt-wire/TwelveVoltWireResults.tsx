'use client';

import { Button } from '@/components/ui/button';
import type { ConductorChoice, TwelveVoltResult } from './calculation';

function num(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString('en-US', { maximumFractionDigits: digits });
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
      <p className="font-medium text-accent">{title}</p>
      <p className="mt-1 text-base font-semibold text-accent">{choice.label}</p>
      <p className="mt-1 text-muted-foreground">
        Nominal area {num(choice.areaMm2, 3)} mm². Equivalent solid diameter {num(choice.diameterMm, 3)} mm. Drop{' '}
        {num(choice.dropVolts, 3)} V ({num(choice.dropPercent, 2)}%).
      </p>
      {choice.dropExceedsSource ? (
        <p className="mt-1 text-xs text-rose-700">This size still drops more than the source voltage. Do not treat the load voltage as a usable operating point.</p>
      ) : (
        <p className="mt-1 text-muted-foreground">
          Estimated load voltage {num(choice.loadVolts, 3)} V. Loop resistance {num(choice.loopResistanceOhm, 4)} Ω. Wiring
          loss {num(choice.powerLossWatts, 2)} W.
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
      <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
        Enter valid values to estimate the voltage-drop area.
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Estimated minimum size by voltage drop
      </p>
      <p className="text-xl font-semibold tabular-nums text-accent">{num(result.minimumAreaMm2, 3)} mm²</p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Ampacity is not verified. This is not a code-compliant or installation recommendation. A conductor that meets
        this area can still be too small for the current, the insulation, or the protective device.
      </p>
      {result.zeroLength ? (
        <p className="text-xs text-muted-foreground">
          One-way length is zero, so the voltage-drop area is zero. Length does not choose a wire in that case.
        </p>
      ) : null}
      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Permitted drop</dt>
          <dd className="font-medium tabular-nums text-accent">
            {num(result.maxDropVolts, 3)} V ({num(result.maxDropPercent, 2)}%)
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Equivalent solid diameter of that area</dt>
          <dd className="font-medium tabular-nums text-accent">{num(result.minimumDiameterMm, 3)} mm</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">One-way length</dt>
          <dd className="font-medium tabular-nums text-accent">{num(result.oneWayMeters, 3)} m</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Conductor temperature</dt>
          <dd className="font-medium tabular-nums text-accent">{num(result.tempC, 1)}°C</dd>
        </div>
      </dl>
      <SizeBlock title="Smallest listed metric size at or above that area" choice={result.metric} />
      <SizeBlock title="Smallest listed AWG at or above that area" choice={result.awg} />
      <p className="text-xs text-muted-foreground">
        AWG and mm² sizes are chosen separately. They are not exact equivalents. Diameter is for a solid round
        conductor of that metal area, not the outside diameter of insulated or stranded cable.
      </p>
      <Button type="button" variant="outline" className="h-11 font-medium" onClick={onCopy}>
        {copied ? 'Copied' : 'Copy result'}
      </Button>
    </div>
  );
}
