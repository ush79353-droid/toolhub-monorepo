/**
 * IVF Due Date Calculator — pure engine (ADR-018).
 *
 * ACOG Committee Opinion 700 (May 2017) Methods for Estimating the Due Date:
 * - Day-3 embryo transfer: EDD = transfer + (266 − 3) = transfer + 263 days
 * - Day-5 embryo transfer: EDD = transfer + (266 − 5) = transfer + 261 days
 * - Own-egg / donor-egg cycle with known retrieval or fertilization:
 *   EDD = retrieval/fertilization + 266 days
 *
 * Plurality does not change the educational 40-week EDD.
 * Planning mode uses the same calendar formula; no invented delivery windows.
 */

import { addDaysToIsoDate } from '../loan/calculation';
import type {
  IvfDueDateInput,
  IvfDueDateResult,
  IvfTransferType,
} from './types';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Fertilization / retrieval → EDD (ACOG). */
export const RETRIEVAL_TO_DUE_DAYS = 266;
/** Day-3 transfer → EDD = transfer + (266 − 3). */
export const DAY3_TRANSFER_TO_DUE_DAYS = 263;
/** Day-5 transfer → EDD = transfer + (266 − 5). */
export const DAY5_TRANSFER_TO_DUE_DAYS = 261;

export const CLASSIFICATION_SOURCE =
  'ACOG Committee Opinion 700 (May 2017): Methods for Estimating the Due Date. Educational calendar dating only.';

export const DISCLAIMER =
  'Educational IVF dating estimate only. Not a medical diagnosis, ultrasound dating, or prenatal care plan. Discuss your due date with your fertility and obstetric clinicians.';

export const PLURALITY_NOTE =
  'Twins or triplets do not change this educational 40-week estimated due date. Delivery timing for multiples is a clinical decision and is not estimated here.';

export function isValidIsoDate(iso: string): boolean {
  const match = ISO_DATE.exec(iso.trim());
  if (!match) return false;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const utc = new Date(Date.UTC(y, m - 1, d));
  return (
    utc.getUTCFullYear() === y &&
    utc.getUTCMonth() === m - 1 &&
    utc.getUTCDate() === d
  );
}

export function formatDueDateDisplay(isoDate: string): string {
  const match = ISO_DATE.exec(isoDate.trim());
  if (!match) return isoDate;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function daysAddedForTransferType(type: IvfTransferType): number {
  switch (type) {
    case 'own_eggs':
    case 'donor_eggs':
      return RETRIEVAL_TO_DUE_DAYS;
    case 'day3_transfer':
      return DAY3_TRANSFER_TO_DUE_DAYS;
    case 'day5_transfer':
      return DAY5_TRANSFER_TO_DUE_DAYS;
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function eventLabelForTransferType(type: IvfTransferType): string {
  switch (type) {
    case 'own_eggs':
    case 'donor_eggs':
      return 'Egg retrieval / fertilization date';
    case 'day3_transfer':
    case 'day5_transfer':
      return 'Embryo transfer date';
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function formulaNoteForTransferType(type: IvfTransferType): string {
  switch (type) {
    case 'own_eggs':
      return `IVF with own eggs: EDD = retrieval/fertilization + ${RETRIEVAL_TO_DUE_DAYS} days (ACOG).`;
    case 'donor_eggs':
      return `IVF with donor eggs: EDD = retrieval/fertilization + ${RETRIEVAL_TO_DUE_DAYS} days (ACOG).`;
    case 'day3_transfer':
      return `Day-3 embryo transfer: EDD = transfer + (${RETRIEVAL_TO_DUE_DAYS} − 3) = transfer + ${DAY3_TRANSFER_TO_DUE_DAYS} days.`;
    case 'day5_transfer':
      return `Day-5 embryo transfer: EDD = transfer + (${RETRIEVAL_TO_DUE_DAYS} − 5) = transfer + ${DAY5_TRANSFER_TO_DUE_DAYS} days.`;
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function calculateIvfDueDate(
  input: IvfDueDateInput,
): IvfDueDateResult | null {
  if (!isValidIsoDate(input.eventDate)) return null;

  const daysAdded = daysAddedForTransferType(input.transferType);
  const dueDateIso = addDaysToIsoDate(input.eventDate.trim(), daysAdded);

  return {
    dueDateIso,
    formattedDueDate: formatDueDateDisplay(dueDateIso),
    eventDateIso: input.eventDate.trim(),
    daysAdded,
    eventLabel: eventLabelForTransferType(input.transferType),
    transferType: input.transferType,
    pregnancyStatus: input.pregnancyStatus,
    plurality: input.plurality,
    pluralityNote: PLURALITY_NOTE,
    planningNote:
      input.pregnancyStatus === 'planning'
        ? 'Planning mode uses the same ACOG calendar formula for a projected transfer or retrieval date. No delivery-window schedule is invented here.'
        : null,
    formulaNote: formulaNoteForTransferType(input.transferType),
    disclaimer: DISCLAIMER,
  };
}
