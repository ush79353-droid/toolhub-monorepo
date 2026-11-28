import { computeWheelHorsepower } from './calculation';
import type {
  WheelHorsepowerFieldErrors,
  WheelHorsepowerInput,
  WheelHorsepowerResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

function parseEfficiency(
  raw: string,
  label: string,
): { value: number | null; error?: string } {
  const n = parseNumber(raw);
  if (n == null) return { value: null, error: `Enter ${label}.` };
  if (n <= 0) return { value: null, error: `${label} must be greater than 0%.` };
  if (n > 100)
    return { value: null, error: `${label} cannot exceed 100%.` };
  return { value: n };
}

export function validateWheelHorsepowerInputs(
  input: WheelHorsepowerInput,
): {
  errors: WheelHorsepowerFieldErrors;
  result: WheelHorsepowerResult | null;
} {
  const errors: WheelHorsepowerFieldErrors = {};
  const mode = input.calculationMode;

  const eng = parseNumber(input.engineHorsepower);
  const whp = parseNumber(input.wheelHorsepower);

  if (mode === 'engine-to-wheel' || mode === 'measured-efficiency') {
    if (eng == null) errors.engineHorsepower = 'Enter engine horsepower.';
    else if (eng <= 0)
      errors.engineHorsepower = 'Engine power must be greater than zero.';
  }
  if (mode === 'wheel-to-engine' || mode === 'measured-efficiency') {
    if (whp == null) errors.wheelHorsepower = 'Enter wheel horsepower.';
    else if (whp <= 0)
      errors.wheelHorsepower = 'Wheel power must be greater than zero.';
  }

  let overallEfficiencyPercent: number | null = null;
  let gearboxPercent: number | null = null;
  let propellerPercent: number | null = null;
  let differentialPercent: number | null = null;
  let driveshaftPercent: number | null = null;

  if (mode !== 'measured-efficiency') {
    if (input.efficiencyMode === 'overall') {
      const e = parseEfficiency(
        input.overallEfficiency,
        'overall drivetrain efficiency',
      );
      if (e.error) errors.overallEfficiency = e.error;
      overallEfficiencyPercent = e.value;
    } else {
      const g = parseEfficiency(input.gearboxEfficiency, 'gearbox efficiency');
      if (g.error) errors.gearboxEfficiency = g.error;
      gearboxPercent = g.value;

      if (input.includePropellerShaft) {
        const p = parseEfficiency(
          input.propellerShaftEfficiency,
          'propeller shaft efficiency',
        );
        if (p.error) errors.propellerShaftEfficiency = p.error;
        propellerPercent = p.value;
      }

      const d = parseEfficiency(
        input.differentialEfficiency,
        'differential efficiency',
      );
      if (d.error) errors.differentialEfficiency = d.error;
      differentialPercent = d.value;

      const s = parseEfficiency(
        input.driveshaftEfficiency,
        'driveshaft efficiency',
      );
      if (s.error) errors.driveshaftEfficiency = s.error;
      driveshaftPercent = s.value;
    }
  }

  if (Object.keys(errors).length > 0) return { errors, result: null };

  return {
    errors,
    result: computeWheelHorsepower({
      mode,
      efficiencyMode: input.efficiencyMode,
      enginePower: eng,
      wheelPower: whp,
      powerUnit: input.powerUnit,
      overallEfficiencyPercent,
      gearboxPercent,
      propellerPercent,
      differentialPercent,
      driveshaftPercent,
      includePropellerShaft: input.includePropellerShaft,
    }),
  };
}
