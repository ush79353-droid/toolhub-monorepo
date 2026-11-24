/**
 * Warfarin dosing — assert-based engine check.
 * Run: npx tsx src/tools/calculators/warfarin-dosing/calculation.test.ts
 */
import {
  TABLE_SOURCES,
  calculateWarfarinDosing,
  lookupMaintenanceBand,
  parseNumber,
  roundMg,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateWarfarinDosingInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

assert(TABLE_SOURCES.uwMedicineMaintenance.length > 0, 'UW source labeled');
assert(TABLE_SOURCES.holbrookAccp2012.includes('ACCP 2012'), 'ACCP source');

assert(parseNumber('') === null, 'empty parse');
assert(parseNumber('2.5') === 2.5, 'parse 2.5');
assert(parseNumber('1,000') === 1000, 'parse commas');
assert(parseNumber('Infinity') === null, 'reject infinity');
assert(roundMg(35.555) === 35.56, 'round mg');

{
  const r = calculateWarfarinDosing(createDefaultInput());
  assert(r.kind === 'incomplete', 'blank → incomplete');
  assert(r.adjustedWeeklyLowMg === null, 'no invented dose on blank');
}

{
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '2.5',
  });
  assert(r.kind === 'incomplete', 'INR alone incomplete');
  assert(r.adjustedWeeklyLowMg === null, 'no dose without weekly total');
}

{
  // Target 2–3, INR 2.5 in range, 35 mg/wk
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '2.5',
    doseText: '35',
    dosePeriod: 'wk',
    targetRange: '2_3',
  });
  assert(r.kind === 'in_range', '2.5 in 2–3 range');
  assert(r.weeklyDoseMg === 35, 'weekly 35');
  assert(r.adjustedWeeklyLowMg === null, 'suppress % change in range');
  assert(r.percentLow === null && r.percentHigh === null, 'no % in range');
}

{
  // INR < 1.5 → +10% to +20% of 35 mg/wk → 38.5–42
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '1.2',
    doseText: '35',
    dosePeriod: 'wk',
    targetRange: '2_3',
  });
  assert(r.kind === 'increase', 'subtherapeutic increase');
  assert(r.percentLow === 10 && r.percentHigh === 20, '+10 to +20');
  assert(r.adjustedWeeklyLowMg === 38.5, '35 * 1.10');
  assert(r.adjustedWeeklyHighMg === 42, '35 * 1.20');
  assert(approx(r.adjustedDailyLowMg!, roundMg(38.5 / 7)), 'daily low');
  assert(approx(r.adjustedDailyHighMg!, roundMg(42 / 7)), 'daily high');
}

{
  // Day unit: 5 mg/day = 35 mg/wk; INR 1.6 → +5% to +15%
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '1.6',
    doseText: '5',
    dosePeriod: 'day',
    targetRange: '2_3',
  });
  assert(r.kind === 'increase', 'day unit increase');
  assert(r.weeklyDoseMg === 35, '5 * 7');
  assert(r.percentLow === 5 && r.percentHigh === 15, '+5 to +15');
  assert(r.adjustedWeeklyLowMg === roundMg(35 * 1.05), 'weekly low');
  assert(r.adjustedWeeklyHighMg === roundMg(35 * 1.15), 'weekly high');
}

{
  // INR 1.8–1.9 → +5% to +10%
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '1.85',
    doseText: '40',
    dosePeriod: 'wk',
    targetRange: '2_3',
  });
  assert(r.kind === 'increase', '1.85 increase');
  assert(r.percentLow === 5 && r.percentHigh === 10, '+5 to +10');
  assert(r.adjustedWeeklyLowMg === 42, '40 * 1.05');
  assert(r.adjustedWeeklyHighMg === 44, '40 * 1.10');
}

{
  // INR 3.1–3.2 → decrease 5%–10% → percent -10 to -5
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '3.15',
    doseText: '40',
    dosePeriod: 'wk',
    targetRange: '2_3',
  });
  assert(r.kind === 'decrease', '3.15 decrease');
  assert(r.percentLow === -10 && r.percentHigh === -5, '-10 to -5');
  assert(r.adjustedWeeklyLowMg === 36, '40 * 0.90');
  assert(r.adjustedWeeklyHighMg === 38, '40 * 0.95');
}

{
  // INR 3.3–3.4 → hold_or_decrease
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '3.3',
    doseText: '40',
    dosePeriod: 'wk',
    targetRange: '2_3',
  });
  assert(r.kind === 'hold_or_decrease', '3.3 hold/decrease');
  assert(r.percentLow === -10 && r.percentHigh === -5, 'hold band %');
}

{
  // INR 3.5–3.9 → -5% to -15%
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '3.7',
    doseText: '40',
    dosePeriod: 'wk',
    targetRange: '2_3',
  });
  assert(r.kind === 'hold_or_decrease', '3.7 hold/decrease');
  assert(r.percentLow === -15 && r.percentHigh === -5, '-15 to -5');
  assert(r.adjustedWeeklyLowMg === 34, '40 * 0.85');
  assert(r.adjustedWeeklyHighMg === 38, '40 * 0.95');
}

{
  // INR > 4.0 (goal 2–3)
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '4.5',
    doseText: '40',
    dosePeriod: 'wk',
    targetRange: '2_3',
  });
  assert(r.kind === 'hold_or_decrease', '>4.0 hold');
  assert(r.percentLow === -15 && r.percentHigh === -5, '>4.0 %');
  assert(r.adjustedWeeklyLowMg != null, 'numeric allowed without bleeding');
}

{
  // Published gap: INR 4.0 exactly is not in 3.5–3.9 and not > 4.0
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '4.0',
    doseText: '40',
    dosePeriod: 'wk',
    targetRange: '2_3',
  });
  assert(r.kind === 'incomplete', 'INR 4.0 gap incomplete');
  assert(r.adjustedWeeklyLowMg === null, 'no invented gap dose');
  assert(/no verified|no published/i.test(r.statusDetail), 'gap messaging');
}

{
  // Gap between 1.7 and 1.8
  const band = lookupMaintenanceBand(1.75, '2_3');
  assert(band === null, '1.75 gap');
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '1.75',
    doseText: '35',
    dosePeriod: 'wk',
    targetRange: '2_3',
  });
  assert(r.kind === 'incomplete', '1.75 incomplete');
  assert(r.adjustedWeeklyLowMg === null, 'suppress gap numeric');
}

{
  // Target 2.5–3.5 in range
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '3.0',
    doseText: '42',
    dosePeriod: 'wk',
    targetRange: '2_5_3_5',
  });
  assert(r.kind === 'in_range', '3.0 in 2.5–3.5');
  assert(r.adjustedWeeklyLowMg === null, 'in-range suppress');
}

{
  // Target 2.5–3.5, INR < 2.0 → +10–20%
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '1.8',
    doseText: '35',
    dosePeriod: 'wk',
    targetRange: '2_5_3_5',
  });
  assert(r.kind === 'increase', 'high-target subtherapeutic');
  assert(r.percentLow === 10 && r.percentHigh === 20, '+10–20 high target');
}

{
  // INR 2.3 → first matching row is 2.0–2.3 (+5–15%)
  const band = lookupMaintenanceBand(2.3, '2_5_3_5');
  assert(band != null && band.percentLow === 5 && band.percentHigh === 15, '2.3 → 5–15');
}

{
  // INR 2.35 → (2.3, 2.4] → +5–10%
  const band = lookupMaintenanceBand(2.35, '2_5_3_5');
  assert(band != null && band.percentLow === 5 && band.percentHigh === 10, '2.35 → 5–10');
}

{
  // INR 4.5 exactly for 2.5–3.5: not in 4.0–4.4 and not > 4.5 → gap
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '4.5',
    doseText: '40',
    dosePeriod: 'wk',
    targetRange: '2_5_3_5',
  });
  assert(r.kind === 'incomplete', 'INR 4.5 gap on high target');
  assert(r.adjustedWeeklyLowMg === null, 'no invented 4.5 dose');
}

{
  // Serious bleeding — suppress numeric even with INR + dose
  const r = calculateWarfarinDosing({
    ...createDefaultInput(),
    inrText: '2.5',
    doseText: '35',
    bleeding: 'serious',
  });
  assert(r.kind === 'bleeding_escalation', 'serious escalation');
  assert(r.adjustedWeeklyLowMg === null, 'suppress numeric on serious');
  assert(/PCC|vitamin K/i.test(r.actionNotes.join(' ')), 'ACCP notes');
}

{
  // Life-threatening — escalation independent of blank INR
  const r = calculateWarfarinDosing({
    ...createEmptyInput(),
    bleeding: 'life_threatening',
  });
  assert(r.kind === 'bleeding_escalation', 'life-threatening without INR');
  assert(r.adjustedWeeklyLowMg === null, 'suppress on life-threatening');
  assert(/emergency|Life-threatening/i.test(r.statusHeadline), 'headline');
}

{
  const v = validateWarfarinDosingInput({
    ...createDefaultInput(),
    inrText: 'abc',
    doseText: '-5',
  });
  assert(v.errors.inrText, 'invalid INR error');
  assert(v.errors.doseText, 'invalid dose error');
  assert(v.result?.kind === 'incomplete', 'errors → incomplete result');
}

{
  const v = validateWarfarinDosingInput({
    ...createDefaultInput(),
    inrText: '2.2',
    doseText: '28',
    dosePeriod: 'wk',
    targetRange: '2_3',
  });
  assert(Object.keys(v.errors).length === 0, 'valid no errors');
  assert(v.result?.kind === 'in_range', '2.2 in range');
}

console.log('warfarin-dosing calculation.test.ts: ok');
