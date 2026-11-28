import { computeTurboSize } from './calculation';
import type {
  TurboSizeFieldErrors,
  TurboSizeInput,
  TurboSizeResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateTurboSizeInputs(input: TurboSizeInput): {
  errors: TurboSizeFieldErrors;
  result: TurboSizeResult | null;
} {
  const errors: TurboSizeFieldErrors = {};

  const capacity = parseNumber(input.engineCapacity);
  if (capacity == null) errors.engineCapacity = 'Enter engine capacity.';
  else if (capacity <= 0)
    errors.engineCapacity = 'Capacity must be greater than zero.';

  const power = parseNumber(input.desiredPower);
  if (power == null) errors.desiredPower = 'Enter desired power.';
  else if (power <= 0) errors.desiredPower = 'Power must be greater than zero.';

  const cFactor = parseNumber(input.horsepowerPerLbMin);
  if (cFactor == null)
    errors.horsepowerPerLbMin = 'Enter hp per lb/min assumption.';
  else if (cFactor <= 0)
    errors.horsepowerPerLbMin = 'Factor must be greater than zero.';

  let advanced = null;
  if (input.advancedMode) {
    const rpm = parseNumber(input.engineRPM);
    if (rpm == null) errors.engineRPM = 'Enter engine RPM.';
    else if (rpm <= 0) errors.engineRPM = 'RPM must be greater than zero.';

    const ve = parseNumber(input.volumetricEfficiency);
    if (ve == null) errors.volumetricEfficiency = 'Enter volumetric efficiency.';
    else if (ve <= 0)
      errors.volumetricEfficiency = 'VE must be greater than zero.';
    else if (ve > 150)
      errors.volumetricEfficiency =
        'VE above 150% is outside the supported range.';

    const pMan = parseNumber(input.intakeManifoldPressure);
    if (pMan == null)
      errors.intakeManifoldPressure = 'Enter intake manifold absolute pressure.';
    else if (pMan <= 0)
      errors.intakeManifoldPressure = 'Absolute pressure must be greater than zero.';

    const pIn = parseNumber(input.compressorInletPressure);
    if (pIn == null)
      errors.compressorInletPressure =
        'Enter compressor inlet absolute pressure.';
    else if (pIn <= 0)
      errors.compressorInletPressure =
        'Absolute pressure must be greater than zero.';

    const tMan = parseNumber(input.intakeTemperature);
    if (tMan == null) errors.intakeTemperature = 'Enter intake temperature.';
    const tIn = parseNumber(input.compressorInletTemperature);
    if (tIn == null)
      errors.compressorInletTemperature = 'Enter compressor inlet temperature.';

    const eta = parseNumber(input.compressorEfficiency);
    if (eta == null)
      errors.compressorEfficiency = 'Enter compressor efficiency.';
    else if (eta <= 0 || eta > 100)
      errors.compressorEfficiency =
        'Compressor efficiency must be greater than 0% and at most 100%.';

    if (
      !errors.intakeTemperature &&
      tMan != null &&
      input.intakeTempUnit === 'K' &&
      tMan <= 0
    ) {
      errors.intakeTemperature = 'Temperature must be above absolute zero.';
    }
    if (
      !errors.compressorInletTemperature &&
      tIn != null &&
      input.inletTempUnit === 'K' &&
      tIn <= 0
    ) {
      errors.compressorInletTemperature =
        'Temperature must be above absolute zero.';
    }

    if (
      Object.keys(errors).filter((k) =>
        [
          'engineRPM',
          'volumetricEfficiency',
          'intakeManifoldPressure',
          'compressorInletPressure',
          'intakeTemperature',
          'compressorInletTemperature',
          'compressorEfficiency',
        ].includes(k),
      ).length === 0
    ) {
      advanced = {
        rpm: rpm!,
        vePercent: ve!,
        intakeManifoldPressure: pMan!,
        intakePressureUnit: input.intakePressureUnit,
        compressorInletPressure: pIn!,
        inletPressureUnit: input.inletPressureUnit,
        intakeTemperature: tMan!,
        intakeTempUnit: input.intakeTempUnit,
        compressorInletTemperature: tIn!,
        inletTempUnit: input.inletTempUnit,
        compressorEfficiencyPercent: eta!,
      };
    }
  }

  if (Object.keys(errors).length > 0) return { errors, result: null };

  return {
    errors,
    result: computeTurboSize(
      {
        capacity: capacity!,
        capacityUnit: input.engineCapacityUnit,
        power: power!,
        powerUnit: input.desiredPowerUnit,
        hpPerLbMin: cFactor!,
      },
      advanced,
    ),
  };
}
