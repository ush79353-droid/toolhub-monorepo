/**
 * Public activation gate for a catalog tool. A calculator is delivered only when
 * this returns `publicRoute: true` after the module, registry, and Mongo record exist.
 * An admin-disabled tool stays off.
 */

export interface ActivationInput {
  componentKey: string;
  registered: boolean;
  hasCalculatorModule: boolean;
  isActive: boolean;
  /** Explicit admin off. Do not treat a never-activated tool as admin-disabled. */
  adminDisabled: boolean;
  embedEnabled: boolean | null | undefined;
}

export interface ActivationDecision {
  eligibleToActivate: boolean;
  publicRoute: boolean;
  embed: boolean;
  reason:
    | 'missing-component'
    | 'missing-component-key'
    | 'missing-registry-key'
    | 'admin-disabled'
    | 'ready-to-activate'
    | 'active';
}

export function decideActivation(input: ActivationInput): ActivationDecision {
  const off = { eligibleToActivate: false, publicRoute: false, embed: false } as const;
  if (!input.hasCalculatorModule) return { ...off, reason: 'missing-component' };
  if (!input.componentKey.trim()) return { ...off, reason: 'missing-component-key' };
  if (!input.registered) return { ...off, reason: 'missing-registry-key' };
  if (input.adminDisabled) return { ...off, reason: 'admin-disabled' };
  const embed = input.embedEnabled !== false;
  if (!input.isActive) {
    return { eligibleToActivate: true, publicRoute: false, embed: false, reason: 'ready-to-activate' };
  }
  return { eligibleToActivate: true, publicRoute: true, embed, reason: 'active' };
}
