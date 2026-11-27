/**
 * Body Shape — educational (ADR-018).
 * Classifier and inch constants reused from body-type (Lee/Istook/calculator.net).
 */

import {
  classifyBodyShape,
  parseNumber,
  SHAPE_LABELS,
  toInches,
} from '../body-type/calculation';
import type { BodyShapeId } from '../body-type/types';
import type { BodyShapeInput, BodyShapeResult } from './types';

export {
  classifyBodyShape,
  CM_PER_INCH,
  HIGH_HIP_WAIST_CUTOFF,
  SHAPE_LABELS,
  toInches,
  fromInches,
  parseNumber,
} from '../body-type/calculation';

import { BODY_SHAPE_CLASSIFICATION_NOTE } from './content';

export const SOURCE_NOTE = BODY_SHAPE_CLASSIFICATION_NOTE;

export const DISCLAIMER =
  'Educational clothing-fit estimate only — not a medical diagnosis.';

export function calculateBodyShape(input: BodyShapeInput): BodyShapeResult {
  const bustRaw = parseNumber(input.bustText);
  const waistRaw = parseNumber(input.waistText);
  const highHipRaw = parseNumber(input.highHipText);
  const hipRaw = parseNumber(input.hipText);

  const bustIn = toInches(bustRaw!, input.bustUnit);
  const waistIn = toInches(waistRaw!, input.waistUnit);
  const highHipIn = toInches(highHipRaw!, input.highHipUnit);
  const hipIn = toInches(hipRaw!, input.hipUnit);

  const shapeId: BodyShapeId = classifyBodyShape(
    bustIn,
    waistIn,
    highHipIn,
    hipIn,
  );
  const shapeLabel = SHAPE_LABELS[shapeId];

  return {
    shapeId,
    shapeLabel,
    resultHeadline: `Body shape is ${shapeLabel}`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}