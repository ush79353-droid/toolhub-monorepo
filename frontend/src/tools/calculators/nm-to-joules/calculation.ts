import { formatAngle } from '../coordinates/calculation';

export function formatAmount(value: number): string {
  return formatAngle(value, 12);
}

/** 1 N = 1 J/m exactly. */
export function newtonsToJoulesPerMeter(newtons: number): number {
  return newtons;
}

export function joulesPerMeterToNewtons(jpm: number): number {
  return jpm;
}

/** 1 J = 1 N·m for work/energy (not torque). */
export function joulesToNewtonMeters(joules: number): number {
  return joules;
}

export function newtonMetersToJoules(nm: number): number {
  return nm;
}

/** W = F d cos(θ) with θ in degrees. */
export function calculateWork(forceN: number, distanceM: number, angleDeg: number): number {
  const radians = (angleDeg * Math.PI) / 180;
  return forceN * distanceM * Math.cos(radians);
}

export function shareResultText(parts: {
  force?: { newtons: string; jpm: string };
  energy?: { joules: string; nm: string };
  work?: { force: string; distance: string; angle: string; work: string };
}): string {
  const lines = ['Nm to Joules Calculator', 'Omega Calculators', ''];

  if (parts.force) {
    lines.push('Force Conversion:');
    lines.push(`${parts.force.newtons} N = ${parts.force.jpm} J/m`);
    lines.push('');
  }
  if (parts.energy) {
    lines.push('Work/Energy Conversion:');
    lines.push(`${parts.energy.joules} J = ${parts.energy.nm} N·m`);
    lines.push('');
  }
  if (parts.work) {
    lines.push('Work Calculation:');
    lines.push(
      `W = ${parts.work.force} N × ${parts.work.distance} m × cos(${parts.work.angle}°) = ${parts.work.work} J`,
    );
    lines.push('');
  }

  lines.push('Relationships:');
  lines.push('1 N = 1 J/m');
  lines.push('1 J = 1 N·m');
  lines.push('');
  lines.push('Calculated with Omega Calculators');
  return lines.join('\n');
}
