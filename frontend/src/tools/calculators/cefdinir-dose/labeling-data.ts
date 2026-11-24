/**
 * Omnicef (cefdinir) — FDA/DailyMed dosage chart (BID q12h regimens).
 * DailyMed setid 9ba5cb2d-6272-27de-e053-2995a90a58c8 (updated Dec 2025).
 */

import type { AdultIndicationId, PediatricIndicationId } from './types';

export interface AdultRegimenRow {
  id: AdultIndicationId;
  label: string;
  doseMg: number;
  intervalHours: 12;
  durationLabel: string;
  /** Label requires BID; once-daily not studied. */
  bidRequired: boolean;
  alternateQ24Note?: string;
}

export interface PediatricRegimenRow {
  id: PediatricIndicationId;
  label: string;
  mgPerKgPerDose: number;
  intervalHours: 12;
  durationLabel: string;
  bidRequired: boolean;
  alternateQ24Note?: string;
}

export const ADULT_REGIMENS: readonly AdultRegimenRow[] = [
  {
    id: 'community_acquired_pneumonia',
    label: 'Community-acquired pneumonia (CAP)',
    doseMg: 300,
    intervalHours: 12,
    durationLabel: '10 days',
    bidRequired: true,
  },
  {
    id: 'acute_exacerbations_chronic_bronchitis',
    label: 'Acute exacerbations of chronic bronchitis',
    doseMg: 300,
    intervalHours: 12,
    durationLabel: '5 to 10 days',
    bidRequired: false,
    alternateQ24Note:
      'Label also lists 600 mg once daily for 10 days as an equivalent option for this indication.',
  },
  {
    id: 'acute_maxillary_sinusitis',
    label: 'Acute maxillary sinusitis',
    doseMg: 300,
    intervalHours: 12,
    durationLabel: '10 days',
    bidRequired: false,
    alternateQ24Note:
      'Label also lists 600 mg once daily for 10 days as an equivalent option for this indication.',
  },
  {
    id: 'pharyngitis_tonsillitis',
    label: 'Pharyngitis/tonsillitis',
    doseMg: 300,
    intervalHours: 12,
    durationLabel: '5 to 10 days',
    bidRequired: false,
    alternateQ24Note:
      'Label also lists 600 mg once daily for 10 days as an equivalent option for this indication.',
  },
  {
    id: 'uncomplicated_skin',
    label: 'Uncomplicated skin and skin structure infections',
    doseMg: 300,
    intervalHours: 12,
    durationLabel: '10 days',
    bidRequired: true,
  },
];

export const PEDIATRIC_REGIMENS: readonly PediatricRegimenRow[] = [
  {
    id: 'acute_bacterial_otitis_media',
    label: 'Acute bacterial otitis media',
    mgPerKgPerDose: 7,
    intervalHours: 12,
    durationLabel: '5 to 10 days',
    bidRequired: false,
    alternateQ24Note:
      'Label also lists 14 mg/kg once daily for 10 days as an equivalent option for this indication.',
  },
  {
    id: 'acute_maxillary_sinusitis',
    label: 'Acute maxillary sinusitis',
    mgPerKgPerDose: 7,
    intervalHours: 12,
    durationLabel: '10 days',
    bidRequired: false,
    alternateQ24Note:
      'Label also lists 14 mg/kg once daily for 10 days as an equivalent option for this indication.',
  },
  {
    id: 'pharyngitis_tonsillitis',
    label: 'Pharyngitis/tonsillitis',
    mgPerKgPerDose: 7,
    intervalHours: 12,
    durationLabel: '5 to 10 days',
    bidRequired: false,
    alternateQ24Note:
      'Label also lists 14 mg/kg once daily for 10 days as an equivalent option for this indication.',
  },
  {
    id: 'uncomplicated_skin',
    label: 'Uncomplicated skin and skin structure infections',
    mgPerKgPerDose: 7,
    intervalHours: 12,
    durationLabel: '10 days',
    bidRequired: true,
  },
];

/** Max mg per pediatric dose (600 mg/day ÷ 2). */
export const PEDIATRIC_MAX_MG_PER_DOSE = 300;