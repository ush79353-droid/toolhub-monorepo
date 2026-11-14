export const INITIAL_SCENARIOS = 4;
export const MAX_SCENARIOS = 20;

export interface ScenarioDraft {
  probability: string;
  stockA: string;
  stockB: string;
}

export interface ExpectedReturnInput {
  scenarios: ScenarioDraft[];
}

export interface ExpectedReturnResult {
  expectedReturnA: number;
  expectedReturnB: number;
  formattedExpectedReturnA: string;
  formattedExpectedReturnB: string;
  probabilityTotal: number;
}

export type ExpectedReturnFieldErrors = {
  form?: string;
  probabilityTotal?: string;
  [key: string]: string | undefined;
};

export function emptyScenario(): ScenarioDraft {
  return { probability: '0', stockA: '', stockB: '' };
}

export function createDefaultInput(): ExpectedReturnInput {
  return {
    scenarios: Array.from({ length: INITIAL_SCENARIOS }, () => emptyScenario()),
  };
}
