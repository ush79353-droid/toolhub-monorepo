export type Paco2Unit = 'mmHg' | 'kPa';

export interface VenousBloodPhInput {
  bicarbonateText: string;
  paco2Text: string;
  paco2Unit: Paco2Unit;
}

export interface VenousBloodPhResult {
  ph: number | null;
  formattedPh: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
  unitNote: string;
}

export type VenousBloodPhFieldErrors = {
  bicarbonateText?: string;
  paco2Text?: string;
};

export function createDefaultInput(): VenousBloodPhInput {
  return {
    bicarbonateText: '',
    paco2Text: '',
    paco2Unit: 'mmHg',
  };
}

export function createEmptyInput(): VenousBloodPhInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: VenousBloodPhInput,
  b: VenousBloodPhInput,
): boolean {
  return (
    a.bicarbonateText === b.bicarbonateText &&
    a.paco2Text === b.paco2Text &&
    a.paco2Unit === b.paco2Unit
  );
}
