export type DistanceUnit = 'm' | 'ft';
export type TemperatureUnit = 'C' | 'F';

export interface TwelveVoltInput {
  voltage: number;
  dropPercent: number;
  material: 'copper' | 'aluminum';
  current: number;
  distance: number;
  distanceUnit: DistanceUnit;
  temperature: number;
  temperatureUnit: TemperatureUnit;
}

export function createDefaultTwelveVoltInput(): TwelveVoltInput {
  return {
    voltage: 12,
    dropPercent: 3,
    material: 'copper',
    current: 10,
    distance: 5,
    distanceUnit: 'm',
    temperature: 50,
    temperatureUnit: 'C',
  };
}
