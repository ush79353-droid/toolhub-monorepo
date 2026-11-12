'use client';

import { AutoLoanCalculator } from '@/tools/calculators/auto-loan/AutoLoanCalculator';
import { LoanCalculator } from '@/tools/calculators/loan/LoanCalculator';
import { RrefCalculator } from '@/tools/calculators/rref/RrefCalculator';
import { ArmMortgageCalculator } from '@/tools/calculators/arm-mortgage/ArmMortgageCalculator';
import { HundredDayCalculator } from '@/tools/calculators/hundred-day/HundredDayCalculator';
import { TwelveVoltWireCalculator } from '@/tools/calculators/twelve-volt-wire/TwelveVoltWireCalculator';
import type { ToolComponent, ToolRegistryMap } from '../types';

/**
 * Component Registry for Omega Calculators
 * Maps database-driven allowlisted component keys to validated React components.
 * Arbitrary code execution from database values is strictly prohibited.
 */
const registry: ToolRegistryMap = {};

export function registerToolComponent(key: string, component: ToolComponent): void {
  if (registry[key] && registry[key] !== component) {
    console.warn(`[ToolRegistry] Overwriting already registered tool component: "${key}"`);
  }
  registry[key] = component;
}

registerToolComponent('AutoLoanCalculator', AutoLoanCalculator);
registerToolComponent('LoanCalculator', LoanCalculator);
registerToolComponent('RrefCalculator', RrefCalculator);
registerToolComponent('ArmMortgageCalculator', ArmMortgageCalculator);
registerToolComponent('HundredDayCalculator', HundredDayCalculator);
registerToolComponent('TwelveVoltWireCalculator', TwelveVoltWireCalculator);

export function getToolComponent(key: string): ToolComponent | null {
  return registry[key] ?? null;
}

export function hasToolComponent(key: string): boolean {
  return key in registry;
}

export function getRegisteredComponentKeys(): string[] {
  return Object.keys(registry);
}
