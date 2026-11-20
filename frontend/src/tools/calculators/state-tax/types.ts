export interface StateTaxInput {
  stateCode: string;
}

export function createDefaultInput(): StateTaxInput {
  return { stateCode: 'AL' };
}
