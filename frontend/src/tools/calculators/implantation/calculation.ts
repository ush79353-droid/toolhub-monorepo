/**
 * Implantation Calculator — educational calendar dating (ADR-018).
 *
 * Natural: Wilcox et al. N Engl J Med 1999 — implantation 6–12 days after
 * ovulation among clinical pregnancies (median used as typical).
 * IVF: calendar band after transfer when embryo age is unknown (ADR-023:
 * do not assume blastocyst vs cleavage without user input).
 */

import { addDaysToIsoDate } from '../loan/calculation';
import { isValidIsoDate } from '../due-date/calculation';
import type {
  ImplantationInput,
  ImplantationResult,
  ImplantationWindow,
} from './types';

/** Wilcox NEJM 1999 implantation range after ovulation (clinical pregnancies). */
export const NATURAL_IMPLANT_MIN_DPO = 6;
export const NATURAL_IMPLANT_MAX_DPO = 12;
export const NATURAL_IMPLANT_TYPICAL_DPO = 9;

/** Educational IVF band after transfer when embryo stage is not specified. */
export const IVF_IMPLANT_MIN_AFTER_TRANSFER = 1;
export const IVF_IMPLANT_MAX_AFTER_TRANSFER = 6;
export const IVF_IMPLANT_TYPICAL_AFTER_TRANSFER = 2;

export const SOURCE_LABEL =
  'Wilcox AJ et al. N Engl J Med. 1999;340:1796-1799 (natural implantation 6–12 days after ovulation). IVF window is an educational calendar band without assumed embryo stage.';

export const DISCLAIMER =
  'Educational implantation timing only — not ultrasound confirmation, not a diagnosis, and not medical advice. Individual implantation varies; follow your clinician.';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatDisplayDate(isoDate: string): string {
  if (!isValidIsoDate(isoDate)) return isoDate;
  const match = ISO_DATE.exec(isoDate.trim())!;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

export function parseCycleLength(raw: string): number | 'invalid' {
  const trimmed = raw.trim();
  if (trimmed === '') return 'invalid';
  if (!/^\d+$/.test(trimmed)) return 'invalid';
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 21 || value > 45) return 'invalid';
  return value;
}

/** Standard calendar estimate: ovulation ≈ LMP + (cycle − 14). */
export function suggestOvulationFromLmp(
  lastPeriodIso: string,
  cycleLengthDays: number,
): string {
  return addDaysToIsoDate(lastPeriodIso, cycleLengthDays - 14);
}

function buildWindow(
  typicalIso: string,
  startIso: string,
  endIso: string,
): ImplantationWindow {
  return {
    startIso,
    endIso,
    typicalIso,
    formattedStart: formatDisplayDate(startIso),
    formattedEnd: formatDisplayDate(endIso),
    formattedTypical: formatDisplayDate(typicalIso),
  };
}

function naturalWindowFromOvulation(ovulationIso: string): ImplantationWindow {
  const typical = addDaysToIsoDate(ovulationIso, NATURAL_IMPLANT_TYPICAL_DPO);
  const start = addDaysToIsoDate(ovulationIso, NATURAL_IMPLANT_MIN_DPO);
  const end = addDaysToIsoDate(ovulationIso, NATURAL_IMPLANT_MAX_DPO);
  return buildWindow(typical, start, end);
}

function ivfWindowFromTransfer(transferIso: string): ImplantationWindow {
  const typical = addDaysToIsoDate(
    transferIso,
    IVF_IMPLANT_TYPICAL_AFTER_TRANSFER,
  );
  const start = addDaysToIsoDate(transferIso, IVF_IMPLANT_MIN_AFTER_TRANSFER);
  const end = addDaysToIsoDate(transferIso, IVF_IMPLANT_MAX_AFTER_TRANSFER);
  return buildWindow(typical, start, end);
}

export function resolveNaturalOvulationIso(
  natural: ImplantationInput['natural'],
): { ovulationIso: string | null; estimated: boolean } {
  if (natural.knowsOvulation === 'yes') {
    if (!isValidIsoDate(natural.ovulationIso)) {
      return { ovulationIso: null, estimated: false };
    }
    return { ovulationIso: natural.ovulationIso.trim(), estimated: false };
  }
  const cycle = parseCycleLength(natural.cycleLengthDaysText);
  if (cycle === 'invalid' || !isValidIsoDate(natural.lastPeriodIso)) {
    return { ovulationIso: null, estimated: false };
  }
  return {
    ovulationIso: suggestOvulationFromLmp(
      natural.lastPeriodIso.trim(),
      cycle,
    ),
    estimated: true,
  };
}

export function calculateImplantation(
  input: ImplantationInput,
): ImplantationResult {
  const { ovulationIso, estimated } = resolveNaturalOvulationIso(input.natural);
  const naturalReady = ovulationIso != null;
  const naturalWindow = naturalReady
    ? naturalWindowFromOvulation(ovulationIso)
    : null;

  const transferReady = isValidIsoDate(input.ivf.transferIso);
  const transferIso = transferReady ? input.ivf.transferIso.trim() : null;
  const ivfWindow = transferIso ? ivfWindowFromTransfer(transferIso) : null;

  const naturalNote = naturalReady
    ? estimated
      ? `Ovulation estimated from LMP + (cycle − 14). Implantation window ≈ ${NATURAL_IMPLANT_MIN_DPO}–${NATURAL_IMPLANT_MAX_DPO} days after ovulation.`
      : `Implantation window ≈ ${NATURAL_IMPLANT_MIN_DPO}–${NATURAL_IMPLANT_MAX_DPO} days after ovulation (typical ≈ day ${NATURAL_IMPLANT_TYPICAL_DPO}).`
    : null;

  const ivfNote = transferReady
    ? `Educational band ${IVF_IMPLANT_MIN_AFTER_TRANSFER}–${IVF_IMPLANT_MAX_AFTER_TRANSFER} days after transfer without assuming embryo stage. Enter embryo age in clinic records — not inferred here.`
    : null;

  return {
    natural: {
      ready: naturalReady,
      ovulationIso,
      ovulationEstimated: estimated,
      window: naturalWindow,
    },
    ivf: {
      ready: transferReady,
      transferIso,
      window: ivfWindow,
      embryoAgeSpecified: false,
    },
    sourceLabel: SOURCE_LABEL,
    disclaimer: DISCLAIMER,
    naturalNote,
    ivfNote,
  };
}

export function shareImplantationText(pageUrl: string): string {
  return [
    'Implantation Calculator | Omega Calculators',
    '',
    'Educational implantation timing for natural conception and IVF transfer.',
    'Reproductive entries are not included in this link.',
    pageUrl,
  ].join('\n');
}