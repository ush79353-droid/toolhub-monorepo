export type KnowMaxHr = 'yes' | 'no';

export interface KarvonenInput {
  restingHrText: string;
  knowMaxHr: KnowMaxHr;
  /** Used when knowMaxHr === 'yes'. */
  maximumHrText: string;
  /** Used when knowMaxHr === 'no' → Fox MHR = 220 − age. */
  ageText: string;
  intensityText: string;
}

export interface KarvonenResult {
  targetHrBpm: number | null;
  heartRateReserveBpm: number | null;
  maximumHrBpm: number | null;
  formattedTargetHr: string;
  formattedReserve: string;
  formattedMaximumHr: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type KarvonenFieldErrors = {
  restingHrText?: string;
  maximumHrText?: string;
  ageText?: string;
  intensityText?: string;
};

/** Screenshot defaults: blank RHR/MHR; Yes for known max; intensity 70%. */
export function createDefaultInput(): KarvonenInput {
  return {
    restingHrText: '',
    knowMaxHr: 'yes',
    maximumHrText: '',
    ageText: '',
    intensityText: '70',
  };
}

export function createEmptyInput(): KarvonenInput {
  return {
    restingHrText: '',
    knowMaxHr: 'yes',
    maximumHrText: '',
    ageText: '',
    intensityText: '70',
  };
}

export function inputsEqual(a: KarvonenInput, b: KarvonenInput): boolean {
  return (
    a.restingHrText === b.restingHrText &&
    a.knowMaxHr === b.knowMaxHr &&
    a.maximumHrText === b.maximumHrText &&
    a.ageText === b.ageText &&
    a.intensityText === b.intensityText
  );
}
