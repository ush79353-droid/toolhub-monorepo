import { DISCLAIMER, SOURCE_NOTE } from './content';
import type {
  LungCapacityInput,
  LungCapacityResult,
  VolumeUnit,
} from './types';

export { DISCLAIMER, SOURCE_NOTE };

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toLiters(value: number, unit: VolumeUnit): number {
  return unit === 'L' ? value : value / 1000;
}

export function fromLiters(liters: number, unit: VolumeUnit): number {
  return unit === 'L' ? liters : liters * 1000;
}

export function formatVolume(liters: number, unit: VolumeUnit): string {
  const v = fromLiters(liters, unit);
  if (unit === 'L') {
    return (Math.round(v * 1000) / 1000).toString();
  }
  return String(Math.round(v * 10) / 10);
}

export function calculateLungCapacity(input: LungCapacityInput): LungCapacityResult {
  const irvRaw = parseNumber(input.irvText);
  const tvRaw = parseNumber(input.tvText);
  const ervRaw = parseNumber(input.ervText);
  const rvRaw = parseNumber(input.rvText);

  const irv = irvRaw === null ? null : toLiters(irvRaw, input.unit);
  const tv = tvRaw === null ? null : toLiters(tvRaw, input.unit);
  const erv = ervRaw === null ? null : toLiters(ervRaw, input.unit);
  const rv = rvRaw === null ? null : toLiters(rvRaw, input.unit);

  const negatives = [irv, tv, erv, rv].some((v) => v !== null && v < 0);
  if (negatives) {
    return {
      tlc: null,
      vc: null,
      frc: null,
      ic: null,
      formattedTlc: '',
      formattedVc: '',
      formattedFrc: '',
      formattedIc: '',
      statusHeadline: 'Invalid volumes',
      statusDetail: 'Lung volumes must be non-negative.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const ic =
    irv !== null && tv !== null ? irv + tv : null;
  const vc =
    irv !== null && tv !== null && erv !== null ? irv + tv + erv : null;
  const frc =
    erv !== null && rv !== null ? erv + rv : null;
  const tlc =
    irv !== null && tv !== null && erv !== null && rv !== null
      ? irv + tv + erv + rv
      : null;

  if (ic === null && vc === null && frc === null && tlc === null) {
    return {
      tlc: null,
      vc: null,
      frc: null,
      ic: null,
      formattedTlc: '',
      formattedVc: '',
      formattedFrc: '',
      formattedIc: '',
      statusHeadline: 'Enter lung volumes',
      statusDetail:
        'Fill IRV, TV, ERV, and RV as needed. Each capacity appears when its dependencies are present.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  return {
    tlc,
    vc,
    frc,
    ic,
    formattedTlc: tlc === null ? '' : formatVolume(tlc, input.unit),
    formattedVc: vc === null ? '' : formatVolume(vc, input.unit),
    formattedFrc: frc === null ? '' : formatVolume(frc, input.unit),
    formattedIc: ic === null ? '' : formatVolume(ic, input.unit),
    statusHeadline: 'Lung capacities',
    statusDetail: `TLC ${tlc === null ? '—' : formatVolume(tlc, input.unit)} · VC ${vc === null ? '—' : formatVolume(vc, input.unit)} · FRC ${frc === null ? '—' : formatVolume(frc, input.unit)} · IC ${ic === null ? '—' : formatVolume(ic, input.unit)} (${input.unit}). Educational only.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
