import {
  ASTM_E11_BY_DESIGNATION,
  ASTM_E11_SIEVES,
  MM_PER_INCH,
  UM_PER_INCH,
  UM_PER_MIL,
  UM_PER_MM,
  type MeshToMicronInput,
  type MeshToMicronResult,
  type OpeningEquivalents,
  type ReverseLookupResult,
  type WireDiameterUnit,
} from './types';

/** Readable length display without ugly trailing zeros. */
export function formatLength(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 10;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 8;
  else digits = 12;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function equivalentsFromUm(um: number): OpeningEquivalents {
  return {
    um,
    mm: um / UM_PER_MM,
    cm: um / 10_000,
    in: um / UM_PER_INCH,
    mil: um / UM_PER_MIL,
  };
}

export function wireToMm(value: number, unit: WireDiameterUnit): number {
  if (unit === 'mm') return value;
  if (unit === 'um') return value / UM_PER_MM;
  return value * MM_PER_INCH;
}

/** Pitch (mm) for mesh count openings per linear inch. */
export function pitchMm(meshCount: number): number {
  return MM_PER_INCH / meshCount;
}

/** Clear opening (µm) for square woven mesh: (pitch − wire) × 1000. */
export function customOpeningUm(meshCount: number, wireMm: number): number {
  return (pitchMm(meshCount) - wireMm) * UM_PER_MM;
}

export function lookupSieve(designation: string) {
  return ASTM_E11_BY_DESIGNATION[designation] ?? null;
}

/**
 * Nearest ASTM E11 sieve by absolute opening difference.
 * Ties prefer the finer sieve (smaller opening).
 */
export function nearestSieve(um: number): ReverseLookupResult {
  let best = ASTM_E11_SIEVES[0]!;
  let bestDiff = Math.abs(um - best.openingUm);

  for (const sieve of ASTM_E11_SIEVES) {
    const diff = Math.abs(um - sieve.openingUm);
    if (diff < bestDiff || (diff === bestDiff && sieve.openingUm < best.openingUm)) {
      best = sieve;
      bestDiff = diff;
    }
  }

  return {
    exact: bestDiff === 0,
    sieve: best,
    differenceUm: um - best.openingUm,
  };
}

export function calculateMeshToMicron(input: MeshToMicronInput): MeshToMicronResult {
  if (input.mode === 'standard') {
    const sieve = lookupSieve(input.sieveDesignation)!;
    const openingUm = sieve.openingUm;
    return {
      mode: 'standard',
      standard: 'ASTM E11',
      sieveLabel: sieve.label,
      openingUm,
      equivalents: equivalentsFromUm(openingUm),
      explanation: `${sieve.label} (ASTM E11) nominal opening = ${formatLength(openingUm)} µm`,
      reverse: null,
      pitchMm: null,
    };
  }

  if (input.mode === 'reverse') {
    const reverse = nearestSieve(input.reverseUm!);
    const openingUm = reverse.sieve.openingUm;
    const matchNote = reverse.exact
      ? `Exact nominal match: ${reverse.sieve.label}`
      : `Nearest: ${reverse.sieve.label} (Δ ${formatLength(reverse.differenceUm)} µm)`;
    return {
      mode: 'reverse',
      standard: 'ASTM E11',
      sieveLabel: reverse.sieve.label,
      openingUm,
      equivalents: equivalentsFromUm(openingUm),
      explanation: `Entered ${formatLength(input.reverseUm!)} µm → ${matchNote}`,
      reverse,
      pitchMm: null,
    };
  }

  // Custom woven mesh.
  const meshCount = input.meshCount!;
  const wireMm = wireToMm(input.wireDiameter!, input.wireUnit);
  const pitch = pitchMm(meshCount);
  const openingUm = customOpeningUm(meshCount, wireMm);
  return {
    mode: 'custom',
    standard: 'ASTM E11',
    sieveLabel: null,
    openingUm,
    equivalents: equivalentsFromUm(openingUm),
    explanation: `Custom mesh ${formatLength(meshCount)} with wire ${formatLength(wireMm)} mm → opening ${formatLength(openingUm)} µm (pitch ${formatLength(pitch)} mm)`,
    reverse: null,
    pitchMm: pitch,
  };
}
