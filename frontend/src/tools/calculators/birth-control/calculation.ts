import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CYCLE_DAYS,
  DAYS_PER_YEAR,
  type BirthControlResult,
  type DurationUnit,
  type FemaleMethod,
  type MaleMethod,
} from './types';

/** Screenshot / Omni cost totals show 2 decimals even for ISO-0 currencies like PKR. */
const DISPLAY_MONEY_DIGITS = 2;

function roundDisplayMoney(amount: number): number {
  const factor = 10 ** DISPLAY_MONEY_DIGITS;
  return Math.round(amount * factor) / factor;
}

export function durationToDays(value: number, unit: DurationUnit): number {
  switch (unit) {
    case 'days':
      return value;
    case 'weeks':
      return value * 7;
    case 'months':
      return value * (DAYS_PER_YEAR / 12);
    case 'years':
      return value * DAYS_PER_YEAR;
  }
}

/** Convert a usage count per `unit` into usage per day. */
export function usageToPerDay(value: number, unit: DurationUnit): number {
  const days = durationToDays(1, unit);
  return value / days;
}

export function isCycleMethod(method: FemaleMethod): boolean {
  return method === 'pill' || method === 'patch' || method === 'ring';
}

export function isLongActingMethod(method: FemaleMethod): boolean {
  return method === 'iud' || method === 'injection' || method === 'implant';
}

export function showsCondomAddon(args: {
  sex: 'female' | 'male';
  femaleMethod: FemaleMethod;
  maleMethod: MaleMethod;
}): boolean {
  if (args.sex === 'male') return args.maleMethod === 'vasectomy';
  return args.femaleMethod !== 'female_condom';
}

export function needsCondomFields(args: {
  sex: 'female' | 'male';
  femaleMethod: FemaleMethod;
  maleMethod: MaleMethod;
  buyCondoms: boolean;
}): boolean {
  if (args.sex === 'male') {
    return args.maleMethod === 'condoms' || args.buyCondoms;
  }
  if (args.femaleMethod === 'female_condom') return true;
  return args.buyCondoms;
}

function condomCost(args: {
  usagePerDay: number;
  pricePerPackage: number;
  amountInPackage: number;
  horizonDays: number;
}): number {
  return (
    (args.usagePerDay * args.pricePerPackage * args.horizonDays) /
    args.amountInPackage
  );
}

export function calculateBirthControlCost(args: {
  sex: 'female' | 'male';
  femaleMethod: FemaleMethod;
  maleMethod: MaleMethod;
  costPerCycle: number;
  longActingPrice: number;
  longevityDays: number;
  procedureCost: number;
  buyCondoms: boolean;
  amountInPackage: number;
  usagePerDay: number;
  pricePerPackage: number;
  horizonDays: number;
  currency: SupportedCurrency;
}): BirthControlResult {
  const {
    sex,
    femaleMethod,
    maleMethod,
    costPerCycle,
    longActingPrice,
    longevityDays,
    procedureCost,
    buyCondoms,
    amountInPackage,
    usagePerDay,
    pricePerPackage,
    horizonDays,
    currency,
  } = args;

  let methodCost = 0;
  let condomPart = 0;

  if (sex === 'male') {
    if (maleMethod === 'condoms') {
      condomPart = condomCost({
        usagePerDay,
        pricePerPackage,
        amountInPackage,
        horizonDays,
      });
    } else {
      methodCost = procedureCost;
      if (buyCondoms) {
        condomPart = condomCost({
          usagePerDay,
          pricePerPackage,
          amountInPackage,
          horizonDays,
        });
      }
    }
  } else if (isLongActingMethod(femaleMethod)) {
    methodCost = (longActingPrice * horizonDays) / longevityDays;
    if (buyCondoms) {
      condomPart = condomCost({
        usagePerDay,
        pricePerPackage,
        amountInPackage,
        horizonDays,
      });
    }
  } else if (isCycleMethod(femaleMethod)) {
    methodCost = (costPerCycle * horizonDays) / CYCLE_DAYS;
    if (buyCondoms) {
      condomPart = condomCost({
        usagePerDay,
        pricePerPackage,
        amountInPackage,
        horizonDays,
      });
    }
  } else if (femaleMethod === 'female_condom') {
    condomPart = condomCost({
      usagePerDay,
      pricePerPackage,
      amountInPackage,
      horizonDays,
    });
  } else {
    methodCost = procedureCost;
    if (buyCondoms) {
      condomPart = condomCost({
        usagePerDay,
        pricePerPackage,
        amountInPackage,
        horizonDays,
      });
    }
  }

  const totalRaw = methodCost + condomPart;
  const total = roundDisplayMoney(totalRaw);

  return {
    total,
    currency,
    formattedTotal: formatBirthControlMoney(total, currency),
    methodCost,
    condomCost: condomPart,
    horizonDays,
    explanation:
      sex === 'female' && isCycleMethod(femaleMethod)
        ? `Recurring methods use a ${CYCLE_DAYS}-day cycle: cost × horizonDays / ${CYCLE_DAYS}. Long-acting methods prorate price over longevity. Condom packs scale as usage × pack price × horizon / pack size.`
        : 'Long-acting and procedure costs are prorated or one-time as applicable; condom packs scale as usage × pack price × horizon / pack size.',
  };
}

export function formatBirthControlMoney(
  amount: number,
  _currency: SupportedCurrency
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: DISPLAY_MONEY_DIGITS,
    maximumFractionDigits: DISPLAY_MONEY_DIGITS,
  }).format(amount);
}
