import type { AreaUnitId } from '../area-converter/types';
import type { LengthUnitId } from '../length-converter/types';
import type { MassUnitId } from '../weight-converter/types';
import type { TemperatureUnit } from '../temperature/types';
import type { VolumeUnitId } from '../volume-conversion/types';

export type ImperialCategory = 'length' | 'area' | 'volume' | 'mass' | 'temperature';

export type ImperialSection = 'imperial' | 'metric' | 'other';

export interface ImperialFieldDef {
  key: string;
  label: string;
  symbol: string;
  section: ImperialSection;
}

export const IMPERIAL_CATEGORIES: readonly {
  id: ImperialCategory;
  label: string;
}[] = [
  { id: 'length', label: 'Length' },
  { id: 'area', label: 'Area' },
  { id: 'volume', label: 'Volume' },
  { id: 'mass', label: 'Mass / Weight' },
  { id: 'temperature', label: 'Temperature' },
] as const;

export const LENGTH_FIELDS: readonly ImperialFieldDef[] = [
  { key: 'in', label: 'Length in inches', symbol: 'in', section: 'imperial' },
  { key: 'ft', label: 'Length in feet', symbol: 'ft', section: 'imperial' },
  { key: 'yd', label: 'Length in yards', symbol: 'yd', section: 'imperial' },
  { key: 'mi', label: 'Length in miles', symbol: 'mi', section: 'imperial' },
  { key: 'mm', label: 'Millimeters', symbol: 'mm', section: 'metric' },
  { key: 'cm', label: 'Centimeters', symbol: 'cm', section: 'metric' },
  { key: 'm', label: 'Meters', symbol: 'm', section: 'metric' },
  { key: 'km', label: 'Kilometers', symbol: 'km', section: 'metric' },
  { key: 'nmi', label: 'Nautical miles', symbol: 'nmi', section: 'other' },
  { key: 'um', label: 'Micrometers', symbol: 'µm', section: 'other' },
  { key: 'nm', label: 'Nanometers', symbol: 'nm', section: 'other' },
] as const;

export const AREA_FIELDS: readonly ImperialFieldDef[] = [
  { key: 'in2', label: 'Square inches', symbol: 'in²', section: 'imperial' },
  { key: 'ft2', label: 'Square feet', symbol: 'ft²', section: 'imperial' },
  { key: 'yd2', label: 'Square yards', symbol: 'yd²', section: 'imperial' },
  { key: 'ac', label: 'Acres', symbol: 'ac', section: 'imperial' },
  { key: 'mi2', label: 'Square miles', symbol: 'mi²', section: 'imperial' },
  { key: 'mm2', label: 'Square millimeters', symbol: 'mm²', section: 'metric' },
  { key: 'cm2', label: 'Square centimeters', symbol: 'cm²', section: 'metric' },
  { key: 'm2', label: 'Square meters', symbol: 'm²', section: 'metric' },
  { key: 'ha', label: 'Hectares', symbol: 'ha', section: 'metric' },
  { key: 'km2', label: 'Square kilometers', symbol: 'km²', section: 'metric' },
] as const;

export const VOLUME_FIELDS: readonly ImperialFieldDef[] = [
  { key: 'usTsp', label: 'US teaspoons', symbol: 'US tsp', section: 'imperial' },
  { key: 'usTbsp', label: 'US tablespoons', symbol: 'US tbsp', section: 'imperial' },
  { key: 'usFlOz', label: 'US fluid ounces', symbol: 'US fl oz', section: 'imperial' },
  { key: 'usCup', label: 'US cups', symbol: 'US cup', section: 'imperial' },
  { key: 'usPt', label: 'US pints', symbol: 'US pt', section: 'imperial' },
  { key: 'usQt', label: 'US quarts', symbol: 'US qt', section: 'imperial' },
  { key: 'usLiquidGal', label: 'US gallons', symbol: 'US gal', section: 'imperial' },
  { key: 'impFlOz', label: 'Imperial fluid ounces', symbol: 'Imp. fl oz', section: 'imperial' },
  { key: 'impPt', label: 'Imperial pints', symbol: 'Imp. pt', section: 'imperial' },
  { key: 'impQt', label: 'Imperial quarts', symbol: 'Imp. qt', section: 'imperial' },
  { key: 'imperialGal', label: 'Imperial gallons', symbol: 'Imp. gal', section: 'imperial' },
  { key: 'in3', label: 'Cubic inches', symbol: 'in³', section: 'imperial' },
  { key: 'ft3', label: 'Cubic feet', symbol: 'ft³', section: 'imperial' },
  { key: 'mL', label: 'Milliliters', symbol: 'mL', section: 'metric' },
  { key: 'L', label: 'Liters', symbol: 'L', section: 'metric' },
  { key: 'cm3', label: 'Cubic centimeters', symbol: 'cm³', section: 'metric' },
  { key: 'm3', label: 'Cubic meters', symbol: 'm³', section: 'metric' },
] as const;

export const MASS_FIELDS: readonly ImperialFieldDef[] = [
  { key: 'oz', label: 'Ounces', symbol: 'oz', section: 'imperial' },
  { key: 'lb', label: 'Pounds', symbol: 'lb', section: 'imperial' },
  { key: 'st', label: 'Stones', symbol: 'st', section: 'imperial' },
  { key: 'shortTon', label: 'US short tons', symbol: 'US ton', section: 'imperial' },
  { key: 'longTon', label: 'UK long tons', symbol: 'UK ton', section: 'imperial' },
  { key: 'mg', label: 'Milligrams', symbol: 'mg', section: 'metric' },
  { key: 'g', label: 'Grams', symbol: 'g', section: 'metric' },
  { key: 'kg', label: 'Kilograms', symbol: 'kg', section: 'metric' },
  { key: 't', label: 'Metric tonnes', symbol: 't', section: 'metric' },
] as const;

export const TEMPERATURE_FIELDS: readonly ImperialFieldDef[] = [
  { key: 'fahrenheit', label: 'Fahrenheit', symbol: '°F', section: 'imperial' },
  { key: 'rankine', label: 'Rankine', symbol: '°R', section: 'imperial' },
  { key: 'celsius', label: 'Celsius', symbol: '°C', section: 'metric' },
  { key: 'kelvin', label: 'Kelvin', symbol: 'K', section: 'metric' },
] as const;

export function fieldsForCategory(category: ImperialCategory): readonly ImperialFieldDef[] {
  if (category === 'length') return LENGTH_FIELDS;
  if (category === 'area') return AREA_FIELDS;
  if (category === 'volume') return VOLUME_FIELDS;
  if (category === 'mass') return MASS_FIELDS;
  return TEMPERATURE_FIELDS;
}

export function sectionTitle(category: ImperialCategory, section: ImperialSection): string {
  if (section === 'other') {
    if (category === 'length') return 'Other length units';
    return 'Other units';
  }
  const imperialLabel =
    category === 'length'
      ? 'Imperial/US length'
      : category === 'area'
        ? 'Imperial/US area'
        : category === 'volume'
          ? 'Imperial/US volume'
          : category === 'mass'
            ? 'Imperial/US mass'
            : 'Imperial/US temperature';
  const metricLabel =
    category === 'length'
      ? 'Metric length'
      : category === 'area'
        ? 'Metric area'
        : category === 'volume'
          ? 'Metric volume'
          : category === 'mass'
            ? 'Metric mass'
            : 'Metric temperature';
  return section === 'imperial' ? imperialLabel : metricLabel;
}

export type LengthFieldKey = (typeof LENGTH_FIELDS)[number]['key'] & LengthUnitId;
export type AreaFieldKey = (typeof AREA_FIELDS)[number]['key'] & AreaUnitId;
export type VolumeFieldKey = (typeof VOLUME_FIELDS)[number]['key'] & VolumeUnitId;
export type MassFieldKey = (typeof MASS_FIELDS)[number]['key'] & MassUnitId;
export type TempFieldKey = (typeof TEMPERATURE_FIELDS)[number]['key'] & TemperatureUnit;

export interface ImperialInput {
  category: ImperialCategory;
  sourceKey: string;
  value: number | null;
}

export interface ImperialResult {
  category: ImperialCategory;
  sourceKey: string;
  /** Canonical base: m / m² / L / kg / K */
  canonical: number;
  values: Record<string, number>;
  explanation: string;
}

export type ImperialFieldErrors = Partial<Record<string, string>>;

export const MAX_ABS_VALUE = 1e18;
