export interface AlbuminGlobulinRatioInput {
  albuminText: string;
  totalProteinText: string;
}

export interface AlbuminGlobulinRatioResult {
  albumin: number | null;
  totalProtein: number | null;
  globulin: number | null;
  agRatio: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AlbuminGlobulinRatioFieldErrors = {
  albuminText?: string;
  totalProteinText?: string;
};

export function createDefaultInput(): AlbuminGlobulinRatioInput {
  return {
    albuminText: '',
    totalProteinText: '',
  };
}

export function createEmptyInput(): AlbuminGlobulinRatioInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: AlbuminGlobulinRatioInput,
  b: AlbuminGlobulinRatioInput,
): boolean {
  return a.albuminText === b.albuminText && a.totalProteinText === b.totalProteinText;
}