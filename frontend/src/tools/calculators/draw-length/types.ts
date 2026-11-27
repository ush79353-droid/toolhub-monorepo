export type LengthUnit = 'cm' | 'm' | 'in' | 'ft';

export type DrawLengthLastEdited = 'wingspan' | 'drawLength';

export interface DrawLengthInput {
  wingspanText: string;
  wingspanUnit: LengthUnit;
  drawLengthText: string;
  drawLengthUnit: LengthUnit;
  lastEdited: DrawLengthLastEdited;
}

export interface DrawLengthResult {
  wingspanCm: number | null;
  drawLengthCm: number | null;
  formattedWingspan: string;
  formattedDrawLength: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type DrawLengthFieldErrors = {
  wingspanText?: string;
  drawLengthText?: string;
};

/** Screenshot defaults: blank fields; inches selected. */
export function createDefaultInput(): DrawLengthInput {
  return {
    wingspanText: '',
    wingspanUnit: 'in',
    drawLengthText: '',
    drawLengthUnit: 'in',
    lastEdited: 'wingspan',
  };
}

export function createEmptyInput(): DrawLengthInput {
  return createDefaultInput();
}

export function inputsEqual(a: DrawLengthInput, b: DrawLengthInput): boolean {
  return (
    a.wingspanText === b.wingspanText &&
    a.wingspanUnit === b.wingspanUnit &&
    a.drawLengthText === b.drawLengthText &&
    a.drawLengthUnit === b.drawLengthUnit &&
    a.lastEdited === b.lastEdited
  );
}
