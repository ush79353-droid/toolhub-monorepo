import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  NMOL_PER_NG_ML,
  VITAMIN_D_MCG_PER_IU,
  ageToYears,
  calculateVitaminD,
  interpretSerum25OhdNgPerMl,
  iuToVitaminDMcg,
  lookupVitaminDDri,
  mcgToVitaminDIu,
  ngPerMlToNmol,
  serumToNgPerMl,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateVitaminDInput } from './validation';

describe('Vitamin D Calculator engine', () => {
  it('screenshot defaults leave DRI and serum empty', () => {
    const result = calculateVitaminD(createDefaultInput());
    assert.equal(result.dri, null);
    assert.equal(result.serum, null);
    assert.match(result.statusHeadline, /Enter age/i);
  });

  it('clear/empty input matches screenshot defaults (serum No)', () => {
    assert.deepEqual(createEmptyInput(), createDefaultInput());
    assert.equal(createDefaultInput().serumKnown, 'no');
    assert.equal(createDefaultInput().ageUnit, 'yrs');
  });

  it('NIH ODS IU factor: 1 mcg = 40 IU (reuses mcg-to-iu helper)', () => {
    assert.equal(VITAMIN_D_MCG_PER_IU, 0.025);
    assert.equal(mcgToVitaminDIu(1), 40);
    assert.equal(iuToVitaminDMcg(40), 1);
    assert.equal(mcgToVitaminDIu(15), 600);
    assert.equal(mcgToVitaminDIu(20), 800);
    assert.equal(mcgToVitaminDIu(10), 400);
  });

  it('DRI by age matches NIH ODS Table 2', () => {
    const infant = lookupVitaminDDri(0.25);
    assert.ok(infant);
    assert.equal(infant.kind, 'ai');
    assert.equal(infant.mcgPerDay, 10);
    assert.equal(infant.iuPerDay, 400);
    assert.equal(infant.ulMcgPerDay, 25);

    const lateInfant = lookupVitaminDDri(0.75);
    assert.ok(lateInfant);
    assert.equal(lateInfant.kind, 'ai');
    assert.equal(lateInfant.mcgPerDay, 10);
    assert.equal(lateInfant.ulMcgPerDay, 38);

    const child = lookupVitaminDDri(2);
    assert.ok(child);
    assert.equal(child.kind, 'rda');
    assert.equal(child.mcgPerDay, 15);
    assert.equal(child.iuPerDay, 600);
    assert.equal(child.lifeStageLabel, '1–3 years');

    const adult = lookupVitaminDDri(40);
    assert.ok(adult);
    assert.equal(adult.mcgPerDay, 15);
    assert.equal(adult.iuPerDay, 600);
    assert.equal(adult.ulMcgPerDay, 100);

    const older = lookupVitaminDDri(71);
    assert.ok(older);
    assert.equal(older.mcgPerDay, 20);
    assert.equal(older.iuPerDay, 800);
    assert.equal(older.lifeStageLabel, '>70 years');
  });

  it('months unit converts before DRI lookup', () => {
    assert.equal(ageToYears(6, 'mo'), 0.5);
    const result = calculateVitaminD({
      ...createDefaultInput(),
      ageText: '3',
      ageUnit: 'mo',
    });
    assert.ok(result.dri);
    assert.equal(result.dri.kind, 'ai');
    assert.equal(result.dri.mcgPerDay, 10);
    assert.equal(result.dri.lifeStageLabel, '0–6 months');
  });

  it('serum ng/mL ↔ nmol/L uses NIH ODS 2.5 factor', () => {
    assert.equal(NMOL_PER_NG_ML, 2.5);
    assert.equal(serumToNgPerMl(50, 'nmol_L'), 20);
    assert.equal(ngPerMlToNmol(20), 50);
    assert.equal(serumToNgPerMl(20, 'ng_mL'), 20);
  });

  it('NIH ODS Table 1 serum bands (ng/mL thresholds)', () => {
    assert.equal(interpretSerum25OhdNgPerMl(11).band, 'deficiency_risk');
    assert.equal(interpretSerum25OhdNgPerMl(12).band, 'inadequate');
    assert.equal(interpretSerum25OhdNgPerMl(19.9).band, 'inadequate');
    assert.equal(interpretSerum25OhdNgPerMl(20).band, 'adequate');
    assert.equal(interpretSerum25OhdNgPerMl(50).band, 'adequate');
    assert.equal(interpretSerum25OhdNgPerMl(50.1).band, 'potential_adverse');
  });

  it('serum Yes with nmol/L interprets independently of DRI', () => {
    const result = calculateVitaminD({
      ...createDefaultInput(),
      ageText: '30',
      serumKnown: 'yes',
      serumValueText: '25',
      serumUnit: 'nmol_L',
    });
    assert.ok(result.dri);
    assert.equal(result.dri.mcgPerDay, 15);
    assert.ok(result.serum);
    assert.equal(result.serum.valueNgPerMl, 10);
    assert.equal(result.serum.band, 'deficiency_risk');
    assert.match(result.statusHeadline, /serum band/i);
  });

  it('mode reset to No leaves serum null even if leftover text cleared by UI', () => {
    const result = calculateVitaminD({
      ...createDefaultInput(),
      ageText: '25',
      serumKnown: 'no',
      serumValueText: '',
    });
    assert.ok(result.dri);
    assert.equal(result.serum, null);
  });

  it('validation rejects negative age and incomplete serum when invalid', () => {
    const badAge = validateVitaminDInput({
      ...createDefaultInput(),
      ageText: '-1',
    });
    assert.ok(badAge.errors.ageText);
    assert.equal(badAge.result, null);

    const badSerum = validateVitaminDInput({
      ...createDefaultInput(),
      serumKnown: 'yes',
      serumValueText: 'abc',
    });
    assert.ok(badSerum.errors.serumValueText);
    assert.equal(badSerum.result, null);
  });

  it('never invents a treatment dose field from serum alone', () => {
    const result = calculateVitaminD({
      ...createDefaultInput(),
      ageText: '45',
      serumKnown: 'yes',
      serumValueText: '8',
      serumUnit: 'ng_mL',
    });
    assert.ok(result.serum);
    assert.equal(result.serum.band, 'deficiency_risk');
    // Result shape has DRI + serum band only — no doseMg / prescribe fields.
    assert.equal('doseMg' in result, false);
    assert.equal('prescribedIu' in result, false);
    assert.match(result.serum.detail, /Not a prescription dose/i);
  });
});
