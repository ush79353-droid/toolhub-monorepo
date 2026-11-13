import { temperatureFactor, MATERIALS } from '@/tools/electrical/conductor';
import type { TwelveVoltInput } from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function validateTwelveVolt(input: TwelveVoltInput): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!finite(input.voltage) || input.voltage <= 0 || input.voltage > 60) {
    errors.voltage = 'Enter a system voltage from just above 0 V through 60 V';
  }
  if (!finite(input.dropPercent) || input.dropPercent < 0.1 || input.dropPercent > 20) {
    errors.dropPercent = 'Enter a voltage-drop limit from 0.1% to 20%';
  }
  if (input.material !== 'copper' && input.material !== 'aluminum') {
    errors.material = 'Choose copper or aluminum';
  }
  if (!finite(input.current) || input.current <= 0 || input.current > 1000) {
    errors.current = 'Enter a current greater than 0 A and at most 1,000 A';
  }
  if (!finite(input.distance) || input.distance < 0 || input.distance > 100000) {
    errors.distance = 'Enter a one-way distance of 0 or more';
  } else if (input.distanceUnit !== 'm' && input.distanceUnit !== 'ft') {
    errors.distance = 'Choose meters or feet';
  }
  const tempC = input.temperatureUnit === 'F' ? ((input.temperature - 32) * 5) / 9 : input.temperature;
  if (input.temperatureUnit !== 'C' && input.temperatureUnit !== 'F') {
    errors.temperature = 'Choose Celsius or Fahrenheit';
  } else if (!finite(input.temperature) || !finite(tempC)) {
    errors.temperature = 'Enter a real conductor temperature';
  } else if (input.material === 'copper' || input.material === 'aluminum') {
    if (!(temperatureFactor(MATERIALS[input.material], tempC) > 0) || tempC < -50 || tempC > 250) {
      errors.temperature = 'Enter a conductor temperature from −50°C to 250°C';
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}
