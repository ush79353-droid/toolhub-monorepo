import { findState, type UsStateOption } from './states';

/** Navigator resolution — no tax arithmetic. */
export function resolveStateTaxDestination(stateCode: string): {
  state: UsStateOption | null;
  available: boolean;
  href: string | null;
} {
  const state = findState(stateCode) ?? null;
  if (!state) return { state: null, available: false, href: null };
  if (!state.calculatorSlug) {
    return { state, available: false, href: null };
  }
  return {
    state,
    available: true,
    href: `/tools/${state.calculatorSlug}`,
  };
}
