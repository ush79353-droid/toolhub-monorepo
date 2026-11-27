export type Paco2Unit = 'mmHg' | 'kPa';

export interface ArterialBloodPhInput {
  bicarbonateText: string;
  paco2Text: string;
  paco2Unit: Paco2Unit;
}

export interface ArterialBloodPhResult {
  ph: number | null;
  formattedPh: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type ArterialBloodPhFieldErrors = {
  bicarbonateText?: string;
  paco2Text?: string;
};

export function createDefaultInput(): ArterialBloodPhInput {
  return {
    bicarbonateText: '',
    paco2Text: '',
    paco2Unit: 'mmHg',
  };
}

export function createEmptyInput(): ArterialBloodPhInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: ArterialBloodPhInput,
  b: ArterialBloodPhInput,
): boolean {
  return (
    a.bicarbonateText === b.bicarbonateText &&
    a.paco2Text === b.paco2Text &&
    a.paco2Unit === b.paco2Unit
  );
}
