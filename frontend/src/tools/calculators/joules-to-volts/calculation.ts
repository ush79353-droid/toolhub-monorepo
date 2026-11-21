import { formatAngle } from '../coordinates/calculation';
import {
  CHARGE_TO_COULOMBS,
  CHARGE_UNIT_SYMBOLS,
  ENERGY_TO_JOULES,
  ENERGY_UNIT_SYMBOLS,
  VOLTAGE_TO_VOLTS,
  VOLTAGE_UNIT_SYMBOLS,
  type ChargeUnit,
  type EnergyUnit,
  type SolveFor,
  type VoltageUnit,
} from './types';

export function formatAmount(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function toJoules(value: number, unit: EnergyUnit): number {
  return value * ENERGY_TO_JOULES[unit];
}

export function fromJoules(joules: number, unit: EnergyUnit): number {
  return joules / ENERGY_TO_JOULES[unit];
}

export function toCoulombs(value: number, unit: ChargeUnit): number {
  return value * CHARGE_TO_COULOMBS[unit];
}

export function fromCoulombs(coulombs: number, unit: ChargeUnit): number {
  return coulombs / CHARGE_TO_COULOMBS[unit];
}

export function toVolts(value: number, unit: VoltageUnit): number {
  return value * VOLTAGE_TO_VOLTS[unit];
}

export function fromVolts(volts: number, unit: VoltageUnit): number {
  return volts / VOLTAGE_TO_VOLTS[unit];
}

/** V = E / Q (base SI: joules, coulombs → volts). */
export function calculateVoltage(energyJ: number, chargeC: number): number {
  return energyJ / chargeC;
}

/** E = V × Q (base SI). */
export function calculateEnergy(voltageV: number, chargeC: number): number {
  return voltageV * chargeC;
}

/** Q = E / V (base SI). */
export function calculateCharge(energyJ: number, voltageV: number): number {
  return energyJ / voltageV;
}

export type SolveOk = {
  ok: true;
  energyJ: number;
  chargeC: number;
  voltageV: number;
  solved: SolveFor;
};

export type SolveErr = { ok: false; error: string; field?: 'energy' | 'charge' | 'voltage' };

export function solveRelation(opts: {
  solveFor: SolveFor;
  energyJ: number | null;
  chargeC: number | null;
  voltageV: number | null;
}): SolveOk | SolveErr {
  const { solveFor, energyJ, chargeC, voltageV } = opts;

  if (solveFor === 'voltage') {
    if (energyJ == null || chargeC == null) {
      return { ok: false, error: 'Enter energy and charge to calculate voltage.' };
    }
    if (chargeC === 0) {
      return { ok: false, error: 'Charge cannot be zero when calculating voltage.', field: 'charge' };
    }
    const voltage = calculateVoltage(energyJ, chargeC);
    if (!Number.isFinite(voltage)) {
      return { ok: false, error: 'Result is outside the finite numeric range.' };
    }
    return { ok: true, energyJ, chargeC, voltageV: voltage, solved: 'voltage' };
  }

  if (solveFor === 'energy') {
    if (voltageV == null || chargeC == null) {
      return { ok: false, error: 'Enter voltage and charge to calculate energy.' };
    }
    const energy = calculateEnergy(voltageV, chargeC);
    if (!Number.isFinite(energy)) {
      return { ok: false, error: 'Result is outside the finite numeric range.' };
    }
    return { ok: true, energyJ: energy, chargeC, voltageV, solved: 'energy' };
  }

  // charge
  if (energyJ == null || voltageV == null) {
    return { ok: false, error: 'Enter energy and voltage to calculate charge.' };
  }
  if (voltageV === 0) {
    return { ok: false, error: 'Voltage cannot be zero when calculating charge.', field: 'voltage' };
  }
  const charge = calculateCharge(energyJ, voltageV);
  if (!Number.isFinite(charge)) {
    return { ok: false, error: 'Result is outside the finite numeric range.' };
  }
  return { ok: true, energyJ, chargeC: charge, voltageV, solved: 'charge' };
}

export function shareResultText(opts: {
  solveFor: SolveFor;
  energyDisplay: string;
  energyUnit: EnergyUnit;
  chargeDisplay: string;
  chargeUnit: ChargeUnit;
  voltageDisplay: string;
  voltageUnit: VoltageUnit;
}): string {
  const formula =
    opts.solveFor === 'voltage'
      ? 'V = E / Q'
      : opts.solveFor === 'energy'
        ? 'E = V × Q'
        : 'Q = E / V';
  return [
    'Joules to Volts Calculator | Omega Calculators',
    '',
    `Direction: ${opts.solveFor} (${formula})`,
    `Energy: ${opts.energyDisplay} ${ENERGY_UNIT_SYMBOLS[opts.energyUnit]}`,
    `Charge: ${opts.chargeDisplay} ${CHARGE_UNIT_SYMBOLS[opts.chargeUnit]}`,
    `Voltage: ${opts.voltageDisplay} ${VOLTAGE_UNIT_SYMBOLS[opts.voltageUnit]}`,
    '',
    'Note: joules alone cannot determine volts; charge is required.',
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
