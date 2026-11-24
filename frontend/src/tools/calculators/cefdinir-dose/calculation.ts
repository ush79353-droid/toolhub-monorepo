/**
 * Cefdinir (Omnicef) labeled dose lookup — FDA/DailyMed regimens (ADR-018).
 *
 * Sources:
 * - DailyMed cefdinir capsules USP (setid 9ba5cb2d-6272-27de-e053-2995a90a58c8), Dec 2025
 * - FDA Omnicef label NDA 050739 (dosage chart aligned with DailyMed)
 *
 * Adults/adolescents: age ≥13 years. Pediatric suspension: 6 months through 12 years.
 * This tool shows the labeled q12h regimen; q24h alternatives appear in statusDetail when allowed.
 */

import {
  ADULT_REGIMENS,
  PEDIATRIC_MAX_MG_PER_DOSE,
  PEDIATRIC_REGIMENS,
} from './labeling-data';
import type {
  AdultIndicationId,
  CefdinirAgeGroup,
  CefdinirDoseInput,
  CefdinirDoseResult,
  CefdinirIndicationId,
  PediatricIndicationId,
} from './types';
import { indicationValidForAgeGroup } from './types';

export const SOURCE_NOTE =
  'Doses follow FDA-approved Omnicef (cefdinir) labeling (DailyMed, Dec 2025): adults/adolescents ≥13 years use 300 mg capsules; children 6 months–12 years use oral suspension at 7 mg/kg every 12 hours (14 mg/kg/day, max 600 mg/day).';

export const DISCLAIMER =
  'Always double-check the calculations, the dosing information, and the contraindications on the leaflet. Consult your health provider before administering any medication. This tool cannot replace real medical consultation.';

const RENAL_NOTE_ADULT =
  'For adult patients with creatinine clearance <30 mL/min/1.73 m², the dose of cefdinir should be 300 mg given once daily.';

const RENAL_NOTE_PEDIATRIC =
  'For pediatric patients with creatinine clearance <30 mL/min/1.73 m², the dose of cefdinir should be 7 mg/kg (up to 300 mg) given once daily.';

export function parseWeightKg(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed.replace(/,/g, ''));
  if (!Number.isFinite(n)) return null;
  return n;
}

function intervalPhrase(hours: number): string {
  if (hours === 12) return 'every 12 hours';
  if (hours === 24) return 'once daily';
  return `every ${hours} hours`;
}

export function formatDoseMg(mg: number): string {
  if (!Number.isFinite(mg)) return '';
  const rounded = Math.round(mg);
  return rounded.toLocaleString('en-US');
}

function buildDosingSentence(doseMg: number, intervalHours: number, duration: string): string {
  return `The patient should take ${formatDoseMg(doseMg)} mg of Omnicef ${intervalPhrase(intervalHours)} for ${duration}.`;
}

function pediatricDoseMg(weightKg: number, mgPerKg: number): number {
  const raw = weightKg * mgPerKg;
  const rounded = Math.round(raw);
  return Math.min(rounded, PEDIATRIC_MAX_MG_PER_DOSE);
}

function regimenDetailAlternate(note: string | undefined): string {
  if (!note) return '';
  return note;
}

export function calculateCefdinirDose(input: CefdinirDoseInput): CefdinirDoseResult {
  const empty: CefdinirDoseResult = {
    dosingSentence: '',
    renalNote: '',
    statusHeadline: 'Select patient type and indication',
    statusDetail:
      'Choose whether the patient is an adult/adolescent (>13 years) or a child (6 months–12 years), then pick a labeled indication.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    doseMgPerAdministration: null,
    intervalHours: null,
    durationLabel: '',
  };

  if (!input.ageGroup) {
    return empty;
  }

  if (!input.indication) {
    return {
      ...empty,
      renalNote:
        input.ageGroup === 'adult' ? RENAL_NOTE_ADULT : RENAL_NOTE_PEDIATRIC,
      statusHeadline: 'Choose an indication',
      statusDetail: 'Select an infection type listed on the Omnicef label for this age group.',
    };
  }

  const ageGroup = input.ageGroup as CefdinirAgeGroup;
  const indication = input.indication as CefdinirIndicationId;

  if (!indicationValidForAgeGroup(ageGroup, indication)) {
    const wrongPop =
      ageGroup === 'adult'
        ? 'Community-acquired pneumonia and chronic bronchitis are labeled for adults/adolescents ≥13 years only. Acute bacterial otitis media is labeled for children 6 months–12 years—not adults.'
        : 'Community-acquired pneumonia is not an FDA-labeled indication for cefdinir in children 6 months–12 years. Choose otitis media, sinusitis, pharyngitis/tonsillitis, or uncomplicated skin infection.';
    return {
      ...empty,
      renalNote:
        ageGroup === 'adult' ? RENAL_NOTE_ADULT : RENAL_NOTE_PEDIATRIC,
      statusHeadline: 'Indication not labeled for this age group',
      statusDetail: wrongPop,
    };
  }

  if (ageGroup === 'adult') {
    const row = ADULT_REGIMENS.find((r) => r.id === (indication as AdultIndicationId));
    if (!row) return empty;

    const alt = regimenDetailAlternate(row.alternateQ24Note);
    const bidNote = row.bidRequired
      ? ' Twice-daily dosing is required for this infection per the label (once-daily dosing was not studied for pneumonia or skin infections).'
      : '';

    return {
      dosingSentence: buildDosingSentence(row.doseMg, row.intervalHours, row.durationLabel),
      renalNote: RENAL_NOTE_ADULT,
      statusHeadline: 'Labeled adult/adolescent regimen',
      statusDetail: `${row.label}: ${row.doseMg} mg ${intervalPhrase(row.intervalHours)} for ${row.durationLabel} (total daily dose 600 mg).${bidNote}${alt ? ` ${alt}` : ''}`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
      doseMgPerAdministration: row.doseMg,
      intervalHours: row.intervalHours,
      durationLabel: row.durationLabel,
    };
  }

  const weightKg = parseWeightKg(input.weightKgText);
  if (weightKg === null) {
    return {
      ...empty,
      renalNote: RENAL_NOTE_PEDIATRIC,
      statusHeadline: 'Enter patient weight',
      statusDetail:
        'Pediatric labeled doses are weight-based (7 mg/kg every 12 hours). Enter weight in kilograms to calculate the mg dose.',
    };
  }

  if (weightKg <= 0 || weightKg > 200) {
    return {
      ...empty,
      renalNote: RENAL_NOTE_PEDIATRIC,
      statusHeadline: 'Invalid weight',
      statusDetail: 'Enter a positive body weight in kilograms (typical pediatric range).',
    };
  }

  const row = PEDIATRIC_REGIMENS.find(
    (r) => r.id === (indication as PediatricIndicationId),
  );
  if (!row) return empty;

  const doseMg = pediatricDoseMg(weightKg, row.mgPerKgPerDose);
  const alt = regimenDetailAlternate(row.alternateQ24Note);
  const bidNote = row.bidRequired
    ? ' Twice-daily dosing is required for pediatric skin infections per the label.'
    : '';

  return {
    dosingSentence: buildDosingSentence(doseMg, row.intervalHours, row.durationLabel),
    renalNote: RENAL_NOTE_PEDIATRIC,
    statusHeadline: 'Labeled pediatric regimen',
    statusDetail: `${row.label} (6 months–12 years): ${row.mgPerKgPerDose} mg/kg ${intervalPhrase(row.intervalHours)} for ${row.durationLabel} at ${formatDoseMg(weightKg)} kg → ${formatDoseMg(doseMg)} mg per dose (max 300 mg/dose; 600 mg/day).${bidNote}${alt ? ` ${alt}` : ''}`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    doseMgPerAdministration: doseMg,
    intervalHours: row.intervalHours,
    durationLabel: row.durationLabel,
  };
}

/** Age boundary helpers for tests — years are informational only (not stored in URL). */
export function ageYearsEligibleForAdultRegimen(years: number): boolean {
  return Number.isFinite(years) && years >= 13;
}

export function ageYearsEligibleForPediatricRegimen(years: number): boolean {
  return Number.isFinite(years) && years >= 0.5 && years <= 12;
}