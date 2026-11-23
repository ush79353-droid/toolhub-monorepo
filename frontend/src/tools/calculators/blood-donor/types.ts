export type BloodType =
  | 'O-'
  | 'O+'
  | 'A-'
  | 'A+'
  | 'B-'
  | 'B+'
  | 'AB-'
  | 'AB+';

export type DonorIntent = 'donate' | 'receive';

export type BloodComponent = 'blood' | 'plasma';

export interface BloodDonorInput {
  intent: DonorIntent;
  component: BloodComponent;
  bloodType: BloodType | '';
}

export interface BloodDonorResult {
  compatibleTypes: BloodType[];
  statusHeadline: string;
  statusDetail: string;
  clinicalNote: string;
  disclaimer: string;
}

export type BloodDonorFieldErrors = {
  bloodType?: string;
};

export const BLOOD_TYPE_OPTIONS: { value: BloodType; label: string }[] = [
  { value: 'O-', label: 'O-' },
  { value: 'O+', label: 'O+' },
  { value: 'A-', label: 'A-' },
  { value: 'A+', label: 'A+' },
  { value: 'B-', label: 'B-' },
  { value: 'B+', label: 'B+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'AB+', label: 'AB+' },
];

export function createDefaultInput(): BloodDonorInput {
  return {
    intent: 'donate',
    component: 'blood',
    bloodType: '',
  };
}

export function createEmptyInput(): BloodDonorInput {
  return createDefaultInput();
}

export function inputsEqual(a: BloodDonorInput, b: BloodDonorInput): boolean {
  return (
    a.intent === b.intent &&
    a.component === b.component &&
    a.bloodType === b.bloodType
  );
}