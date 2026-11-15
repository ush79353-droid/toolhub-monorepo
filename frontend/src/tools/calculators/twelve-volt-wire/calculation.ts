import {
  MATERIALS,
  fahrenheitToCelsius,
  feetToMeters,
  loopResistanceOhm,
  minimumAreaM2,
  resistivityOhmM,
  smallestAwg,
  smallestMetric,
  solidDiameterMm,
  type ConductorMaterialId,
} from '@/tools/electrical/conductor';
import type { TwelveVoltInput } from './types';

export interface ConductorChoice {
  label: string;
  areaMm2: number;
  diameterMm: number;
  loopResistanceOhm: number;
  dropVolts: number;
  dropPercent: number;
  loadVolts: number;
  powerLossWatts: number;
  dropExceedsSource: boolean;
}

export interface TwelveVoltResult {
  material: ConductorMaterialId;
  voltage: number;
  current: number;
  oneWayMeters: number;
  tempC: number;
  maxDropVolts: number;
  maxDropPercent: number;
  rhoOhmM: number;
  minimumAreaMm2: number;
  minimumDiameterMm: number;
  /** Loop resistance of the voltage-drop area, supply plus return. */
  minimumLoopResistanceOhm: number;
  /** I²R at that area. Equals I × permitted drop when length is positive. */
  minimumPowerLossWatts: number;
  metric: ConductorChoice | null;
  awg: (ConductorChoice & { awg: number }) | null;
  /** No published ampacity table is applied. */
  ampacityVerified: false;
  zeroLength: boolean;
}

function choice(
  label: string,
  areaMm2: number,
  rho: number,
  lengthM: number,
  current: number,
  voltage: number,
  awg?: number
): ConductorChoice & { awg?: number } {
  const areaM2 = areaMm2 * 1e-6;
  const resistance = loopResistanceOhm(rho, lengthM, areaM2);
  const dropVolts = current * resistance;
  return {
    label,
    areaMm2,
    diameterMm: solidDiameterMm(areaMm2),
    loopResistanceOhm: resistance,
    dropVolts,
    dropPercent: voltage === 0 ? 0 : (dropVolts / voltage) * 100,
    loadVolts: voltage - dropVolts,
    powerLossWatts: current * current * resistance,
    dropExceedsSource: dropVolts > voltage + 1e-9,
    ...(awg === undefined ? {} : { awg }),
  };
}

export function calculateTwelveVolt(input: TwelveVoltInput): TwelveVoltResult {
  const material = MATERIALS[input.material];
  const tempC = input.temperatureUnit === 'F' ? fahrenheitToCelsius(input.temperature) : input.temperature;
  const rho = resistivityOhmM(material, tempC);
  const oneWayMeters = input.distanceUnit === 'ft' ? feetToMeters(input.distance) : input.distance;
  const maxDropVolts = input.voltage * (input.dropPercent / 100);
  const areaM2 = minimumAreaM2(rho, input.current, oneWayMeters, maxDropVolts);
  const minimumAreaMm2 = areaM2 * 1e6;
  const minimumLoopResistanceOhm = loopResistanceOhm(rho, oneWayMeters, areaM2);
  const metricSize = smallestMetric(minimumAreaMm2);
  const awgSize = smallestAwg(minimumAreaMm2);
  return {
    material: input.material,
    voltage: input.voltage,
    current: input.current,
    oneWayMeters,
    tempC,
    maxDropVolts,
    maxDropPercent: input.dropPercent,
    rhoOhmM: rho,
    minimumAreaMm2,
    minimumDiameterMm: solidDiameterMm(minimumAreaMm2),
    minimumLoopResistanceOhm,
    minimumPowerLossWatts: input.current * input.current * minimumLoopResistanceOhm,
    metric: metricSize
      ? (choice(metricSize.label, metricSize.areaMm2, rho, oneWayMeters, input.current, input.voltage) as ConductorChoice)
      : null,
    awg: awgSize
      ? (choice(awgSize.label, awgSize.areaMm2, rho, oneWayMeters, input.current, input.voltage, awgSize.awg) as ConductorChoice & {
          awg: number;
        })
      : null,
    ampacityVerified: false,
    zeroLength: oneWayMeters === 0,
  };
}
