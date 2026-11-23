/** Ankle-Brachial Index — higher ankle SBP ÷ higher brachial SBP (educational). */

export interface AbiInput {
  armMmHg: string;
  rightFootMmHg: string;
  leftFootMmHg: string;
}

export interface AbiSideResult {
  abi: number;
  formattedAbi: string;
}

export interface AbiResult {
  right: AbiSideResult | null;
  left: AbiSideResult | null;
}

export type AbiFieldErrors = {
  armMmHg?: string;
  rightFootMmHg?: string;
  leftFootMmHg?: string;
};

export function createDefaultInput(): AbiInput {
  return {
    armMmHg: '',
    rightFootMmHg: '',
    leftFootMmHg: '',
  };
}

export function createEmptyInput(): AbiInput {
  return createDefaultInput();
}

export function inputsEqual(a: AbiInput, b: AbiInput): boolean {
  return (
    a.armMmHg === b.armMmHg &&
    a.rightFootMmHg === b.rightFootMmHg &&
    a.leftFootMmHg === b.leftFootMmHg
  );
}
