import { formatAngle } from '../coordinates/calculation';
import { QUANTITIES, type QuantityId } from './types';

export function formatAmount(value: number): string {
  return formatAngle(value, 12);
}

export function siToCgs(si: number, quantity: QuantityId): number {
  return si * QUANTITIES[quantity].siToCgsFactor;
}

export function cgsToSi(cgs: number, quantity: QuantityId): number {
  return cgs / QUANTITIES[quantity].siToCgsFactor;
}

export function shareResultText(input: {
  quantity: QuantityId;
  si: string;
  cgs: string;
}): string {
  const def = QUANTITIES[input.quantity];
  return [
    'CGS System of Units Converter',
    'Omega Calculators',
    '',
    `Quantity: ${def.label}`,
    '',
    'SI:',
    `${input.si} ${def.siUnit}`,
    '',
    'CGS:',
    `${input.cgs} ${def.cgsUnit}`,
    '',
    'Conversion:',
    def.formula,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
