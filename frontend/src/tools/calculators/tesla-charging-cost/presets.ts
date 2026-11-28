/**
 * Illustrative Tesla presets for education — not OEM-certified specs.
 * Capacities/efficiency vary by year, trim, wheels, and market.
 * Users can override all values. Custom starts empty for full control.
 */

export interface TeslaVehiclePreset {
  id: string;
  manufacturer: 'Tesla';
  model: string;
  variant: string;
  modelYear?: number;
  usableBatteryCapacityKWh: number;
  efficiencyKWhPer100Km: number;
  isEstimate: true;
  note: string;
}

export const TESLA_PRESETS: readonly TeslaVehiclePreset[] = [
  {
    id: 'custom',
    manufacturer: 'Tesla',
    model: 'Custom',
    variant: 'User-defined',
    usableBatteryCapacityKWh: 60,
    efficiencyKWhPer100Km: 21.75,
    isEstimate: true,
    note: 'Enter your own capacity and efficiency.',
  },
  {
    id: 'model-3',
    manufacturer: 'Tesla',
    model: 'Model 3',
    variant: 'Illustrative RWD-class',
    usableBatteryCapacityKWh: 60,
    efficiencyKWhPer100Km: 14.5,
    isEstimate: true,
    note: 'Estimate only — varies by year/trim.',
  },
  {
    id: 'model-3-lr',
    manufacturer: 'Tesla',
    model: 'Model 3',
    variant: 'Long Range (illustrative)',
    usableBatteryCapacityKWh: 75,
    efficiencyKWhPer100Km: 15.5,
    isEstimate: true,
    note: 'Estimate only — varies by year/trim.',
  },
  {
    id: 'model-3-perf',
    manufacturer: 'Tesla',
    model: 'Model 3',
    variant: 'Performance (illustrative)',
    usableBatteryCapacityKWh: 75,
    efficiencyKWhPer100Km: 17,
    isEstimate: true,
    note: 'Estimate only — varies by year/trim.',
  },
  {
    id: 'model-y',
    manufacturer: 'Tesla',
    model: 'Model Y',
    variant: 'Illustrative',
    usableBatteryCapacityKWh: 60,
    efficiencyKWhPer100Km: 16,
    isEstimate: true,
    note: 'Estimate only — varies by year/trim.',
  },
  {
    id: 'model-y-lr',
    manufacturer: 'Tesla',
    model: 'Model Y',
    variant: 'Long Range (illustrative)',
    usableBatteryCapacityKWh: 75,
    efficiencyKWhPer100Km: 17,
    isEstimate: true,
    note: 'Estimate only — varies by year/trim.',
  },
  {
    id: 'model-y-perf',
    manufacturer: 'Tesla',
    model: 'Model Y',
    variant: 'Performance (illustrative)',
    usableBatteryCapacityKWh: 75,
    efficiencyKWhPer100Km: 18.5,
    isEstimate: true,
    note: 'Estimate only — varies by year/trim.',
  },
  {
    id: 'model-s',
    manufacturer: 'Tesla',
    model: 'Model S',
    variant: 'Illustrative',
    usableBatteryCapacityKWh: 95,
    efficiencyKWhPer100Km: 18,
    isEstimate: true,
    note: 'Estimate only — varies by year/trim.',
  },
  {
    id: 'model-s-plaid',
    manufacturer: 'Tesla',
    model: 'Model S',
    variant: 'Plaid (illustrative)',
    usableBatteryCapacityKWh: 95,
    efficiencyKWhPer100Km: 20,
    isEstimate: true,
    note: 'Estimate only — varies by year/trim.',
  },
  {
    id: 'model-x',
    manufacturer: 'Tesla',
    model: 'Model X',
    variant: 'Illustrative',
    usableBatteryCapacityKWh: 95,
    efficiencyKWhPer100Km: 21,
    isEstimate: true,
    note: 'Estimate only — varies by year/trim.',
  },
  {
    id: 'model-x-plaid',
    manufacturer: 'Tesla',
    model: 'Model X',
    variant: 'Plaid (illustrative)',
    usableBatteryCapacityKWh: 95,
    efficiencyKWhPer100Km: 22.5,
    isEstimate: true,
    note: 'Estimate only — varies by year/trim.',
  },
];

export function getPreset(id: string): TeslaVehiclePreset | undefined {
  return TESLA_PRESETS.find((p) => p.id === id);
}

export function presetLabel(p: TeslaVehiclePreset): string {
  if (p.id === 'custom') return 'Custom Tesla';
  return `Tesla ${p.model} — ${p.variant}`;
}
