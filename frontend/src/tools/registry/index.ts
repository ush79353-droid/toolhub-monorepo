import type { ToolComponent, ToolRegistryMap } from '../types';

/**
 * Component Registry for Omega Calculators
 * Maps database-driven component keys to validated React components.
 * Tools are dynamically resolved at runtime while ensuring strict type safety.
 */
const registry: ToolRegistryMap = {};

export function registerToolComponent(key: string, component: ToolComponent): void {
  if (registry[key]) {
    console.warn(`[ToolRegistry] Overwriting already registered tool component: "${key}"`);
  }
  registry[key] = component;
}

export function getToolComponent(key: string): ToolComponent | null {
  return registry[key] ?? null;
}

export function hasToolComponent(key: string): boolean {
  return key in registry;
}

export function getRegisteredComponentKeys(): string[] {
  return Object.keys(registry);
}
