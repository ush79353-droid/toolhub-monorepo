import {
  calculateCurtainPanelResults,
  convertLengthToCm,
} from './calculation';
import type {
  CurtainPanelFieldErrors,
  CurtainPanelInput,
  CurtainPanelResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

function parsePositiveInt(raw: string): number | null {
  const n = parseNumber(raw);
  if (n == null || !Number.isInteger(n)) return null;
  return n;
}

export function validateCurtainPanelInputs(input: CurtainPanelInput): {
  errors: CurtainPanelFieldErrors;
  result: CurtainPanelResult | null;
} {
  const errors: CurtainPanelFieldErrors = {};
  const unit = input.unit;

  const fullness = parseNumber(input.fullnessRatio);
  const rod = parseNumber(input.rodWidth);
  const length = parseNumber(input.finishedLength);
  const panels = parsePositiveInt(input.numberOfPanels);
  const fabricW = parseNumber(input.fabricWidth);
  const side = parseNumber(input.sideHemAllowance);
  const top = parseNumber(input.topAllowance);
  const bottom = parseNumber(input.bottomAllowance);
  const join = parseNumber(input.joiningSeamAllowance);
  const repeat = parseNumber(input.patternRepeat);
  const shrink = parseNumber(input.shrinkagePercentage);
  const waste = parseNumber(input.wastePercentage);

  if (fullness == null || fullness <= 0)
    errors.fullnessRatio = 'Fullness must be greater than zero.';
  if (rod == null) errors.rodWidth = 'Enter curtain rod width.';
  else if (rod <= 0) errors.rodWidth = 'Rod width must be greater than zero.';
  if (length == null) errors.finishedLength = 'Enter finished curtain length.';
  else if (length <= 0)
    errors.finishedLength = 'Curtain length must be greater than zero.';
  if (panels == null || panels <= 0)
    errors.numberOfPanels = 'Number of panels must be a positive whole number.';
  if (fabricW == null) errors.fabricWidth = 'Enter usable fabric width.';
  else if (fabricW <= 0)
    errors.fabricWidth = 'Fabric width must be greater than zero.';
  if (side == null || side < 0)
    errors.sideHemAllowance = 'Side hem must be zero or positive.';
  if (top == null || top < 0)
    errors.topAllowance = 'Top allowance must be zero or positive.';
  if (bottom == null || bottom < 0)
    errors.bottomAllowance = 'Bottom hem must be zero or positive.';
  if (join == null || join < 0)
    errors.joiningSeamAllowance = 'Joining seam must be zero or positive.';
  if (repeat == null || repeat < 0)
    errors.patternRepeat = 'Pattern repeat must be zero or positive.';
  if (shrink == null || shrink < 0 || shrink >= 100)
    errors.shrinkagePercentage = 'Shrinkage must be 0% to under 100%.';
  if (waste == null || waste < 0)
    errors.wastePercentage = 'Waste must be zero or greater.';

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateCurtainPanelResults({
    panelType: input.panelType,
    fullnessRatio: fullness!,
    rodWidthCm: convertLengthToCm(rod!, unit),
    finishedLengthCm: convertLengthToCm(length!, unit),
    numberOfPanels: panels!,
    fabricWidthCm: convertLengthToCm(fabricW!, unit),
    sideHemAllowanceCm: convertLengthToCm(side!, unit),
    topAllowanceCm: convertLengthToCm(top!, unit),
    bottomAllowanceCm: convertLengthToCm(bottom!, unit),
    joiningSeamAllowanceCm: convertLengthToCm(join!, unit),
    patternRepeatCm: convertLengthToCm(repeat!, unit),
    shrinkagePercentage: shrink!,
    wastePercentage: waste!,
  });

  return { errors, result };
}
