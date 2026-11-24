/**
 * ABO/Rh red cell and plasma compatibility — educational transfusion tables (ADR-018).
 *
 * Red-cell rules follow standard ABO/Rh. Plasma rules are reversed (AB universal donor,
 * O universal recipient for plasma).
 */

import type {
  BloodComponent,
  BloodDonorInput,
  BloodDonorResult,
  BloodType,
  DonorIntent,
} from './types';

export const DISCLAIMER =
  'Educational compatibility reference only. Real transfusion decisions require crossmatch, antibody screens, and local blood-bank protocols—not this page.';

export const CLINICAL_NOTE =
  'Red-cell “blood” means packed RBCs; plasma uses separate ABO rules. Universal RBC donor: O−; universal RBC recipient: AB+. Universal plasma donor: AB; universal plasma recipient: O (for FFP).';

const ALL_TYPES: BloodType[] = [
  'O-',
  'O+',
  'A-',
  'A+',
  'B-',
  'B+',
  'AB-',
  'AB+',
];

/** Red cells: donor → who may receive */
const RBC_DONOR_TO_RECIPIENT: Record<BloodType, BloodType[]> = {
  'O-': ALL_TYPES,
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

/** Red cells: recipient → who may donate */
const RBC_RECIPIENT_FROM_DONOR: Record<BloodType, BloodType[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ALL_TYPES,
};

/** Plasma: donor → recipients */
const PLASMA_DONOR_TO_RECIPIENT: Record<BloodType, BloodType[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'O+', 'A-', 'A+'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'O+', 'B-', 'B+'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ALL_TYPES,
  'AB+': ALL_TYPES,
};

/** Plasma: recipient → donors (exact inverse of PLASMA_DONOR_TO_RECIPIENT). */
const PLASMA_RECIPIENT_FROM_DONOR: Record<BloodType, BloodType[]> = {
  'O-': ALL_TYPES,
  'O+': ['O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A-', 'A+', 'AB-', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B-', 'B+', 'AB-', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB-', 'AB+'],
};

export function compatibleBloodTypes(
  intent: DonorIntent,
  component: BloodComponent,
  bloodType: BloodType,
): BloodType[] {
  if (component === 'blood') {
    return intent === 'donate'
      ? RBC_DONOR_TO_RECIPIENT[bloodType]
      : RBC_RECIPIENT_FROM_DONOR[bloodType];
  }
  return intent === 'donate'
    ? PLASMA_DONOR_TO_RECIPIENT[bloodType]
    : PLASMA_RECIPIENT_FROM_DONOR[bloodType];
}

export function calculateBloodDonor(input: BloodDonorInput): BloodDonorResult {
  if (!input.bloodType) {
    return {
      compatibleTypes: [],
      statusHeadline: 'Select your blood type',
      statusDetail:
        'Choose ABO/Rh type, whether you want to donate or receive, and blood vs plasma to see compatible types.',
      clinicalNote: CLINICAL_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const types = compatibleBloodTypes(
    input.intent,
    input.component,
    input.bloodType,
  );
  const componentLabel = input.component === 'blood' ? 'red cells' : 'plasma';
  const action =
    input.intent === 'donate'
      ? `may receive your ${componentLabel}`
      : `may donate ${componentLabel} to you`;

  return {
    compatibleTypes: types,
    statusHeadline: 'Compatible blood types',
    statusDetail: `${input.bloodType} — types that ${action}: ${types.join(', ')}.`,
    clinicalNote: CLINICAL_NOTE,
    disclaimer: DISCLAIMER,
  };
}