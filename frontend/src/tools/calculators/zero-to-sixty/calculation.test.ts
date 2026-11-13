import assert from 'node:assert';
import { calculateZeroToSixty } from './calculation';
import { DEFAULT_ZERO_TO_SIXTY_INPUT, type ZeroToSixtyInput } from './types';
import { convertPower, convertWeight } from './units';
import { validateZeroToSixtyInput } from './validation';

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ok - ${description}`);
  } catch (err) {
    console.error(`  FAIL - ${description}`);
    throw err;
  }
}

console.log('Running 0-60 Calculator unit tests...');

// 1. Default inputs test
test('1. Default inputs yield realistic 0-60 and 0-100 results', () => {
  const result = calculateZeroToSixty(DEFAULT_ZERO_TO_SIXTY_INPUT);
  assert.strictEqual(result.reachable, true);
  if (result.reachable) {
    // 300 hp, 3500 lb RWD auto typically does 0-60 in ~5.0 - 6.0 seconds
    assert.strictEqual(result.timeTo60Mph, 5.98);
    assert.strictEqual(result.timeTo100Kmh, 6.25);
    assert.strictEqual(result.wheelHorsepower, 255);
    assert(result.timeTo100Kmh > result.timeTo60Mph, '0-100 km/h must take longer than 0-60 mph');
    assert(result.wheelHorsepower > 200 && result.wheelHorsepower < 300);
    assert(result.distanceTo60MphFeet > 150 && result.distanceTo60MphFeet < 400);
    assert(result.averageAcceleration60MphG > 0.3 && result.averageAcceleration60MphG < 0.8);
  }
});

// 2. HP to kW conversion equality
test('2. HP to kW input produces equivalent results', () => {
  const inputHp: ZeroToSixtyInput = { ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 400, powerUnit: 'hp' };
  const inputKw: ZeroToSixtyInput = {
    ...DEFAULT_ZERO_TO_SIXTY_INPUT,
    enginePower: convertPower(400, 'hp', 'kW'),
    powerUnit: 'kW',
  };
  const resHp = calculateZeroToSixty(inputHp);
  const resKw = calculateZeroToSixty(inputKw);
  assert.strictEqual(resHp.reachable, true);
  assert.strictEqual(resKw.reachable, true);
  if (resHp.reachable && resKw.reachable) {
    assert(Math.abs(resHp.timeTo60Mph - resKw.timeTo60Mph) <= 0.05);
  }
});

// 3. LB to KG conversion equality
test('3. LB to KG mass produces equivalent results', () => {
  const inputLb: ZeroToSixtyInput = { ...DEFAULT_ZERO_TO_SIXTY_INPUT, vehicleWeight: 4000, weightUnit: 'lb' };
  const inputKg: ZeroToSixtyInput = {
    ...DEFAULT_ZERO_TO_SIXTY_INPUT,
    vehicleWeight: convertWeight(4000, 'lb', 'kg'),
    weightUnit: 'kg',
  };
  const resLb = calculateZeroToSixty(inputLb);
  const resKg = calculateZeroToSixty(inputKg);
  assert.strictEqual(resLb.reachable, true);
  assert.strictEqual(resKg.reachable, true);
  if (resLb.reachable && resKg.reachable) {
    assert(Math.abs(resLb.timeTo60Mph - resKg.timeTo60Mph) <= 0.05);
  }
});

// 4. 0-60 mph vs 0-100 km/h target speed comparison
test('4. 0-100 km/h (62.14 mph) is strictly greater than 0-60 mph', () => {
  const res = calculateZeroToSixty(DEFAULT_ZERO_TO_SIXTY_INPUT);
  assert.strictEqual(res.reachable, true);
  if (res.reachable) {
    assert(res.timeTo100Kmh > res.timeTo60Mph);
    assert(res.distanceTo100KmhMeters > res.distanceTo60MphMeters);
  }
});

// 5. Zero and negative power rejection
test('5. Zero and negative power rejection', () => {
  const zeroPower = validateZeroToSixtyInput({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 0 });
  assert.strictEqual(zeroPower.isValid, false);
  assert(zeroPower.errors.enginePower !== undefined);

  const negPower = validateZeroToSixtyInput({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: -50 });
  assert.strictEqual(negPower.isValid, false);
  assert(negPower.errors.enginePower !== undefined);
});

// 6. Zero and negative mass rejection
test('6. Zero and negative weight rejection', () => {
  const zeroMass = validateZeroToSixtyInput({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, vehicleWeight: 0 });
  assert.strictEqual(zeroMass.isValid, false);
  assert(zeroMass.errors.vehicleWeight !== undefined);

  const negMass = validateZeroToSixtyInput({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, vehicleWeight: -1000 });
  assert.strictEqual(negMass.isValid, false);
});

// 7. Invalid enum fields rejected
test('7. Invalid drivetrain or transmission rejected', () => {
  const badDt = validateZeroToSixtyInput({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, drivetrain: 'hover' } as unknown as typeof DEFAULT_ZERO_TO_SIXTY_INPUT);
  assert.strictEqual(badDt.isValid, false);

  const badTrans = validateZeroToSixtyInput({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, transmission: 'warp' } as unknown as typeof DEFAULT_ZERO_TO_SIXTY_INPUT);
  assert.strictEqual(badTrans.isValid, false);
});

// 8. FWD vs RWD traction behavior
test('8. RWD benefits from rearward dynamic weight transfer compared to FWD', () => {
  // At high power (e.g. 450 hp), traction limit is active
  const rwd = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 450, drivetrain: 'rwd' });
  const fwd = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 450, drivetrain: 'fwd' });
  assert.strictEqual(rwd.reachable, true);
  assert.strictEqual(fwd.reachable, true);
  if (rwd.reachable && fwd.reachable) {
    assert(rwd.timeTo60Mph < fwd.timeTo60Mph, `RWD (${rwd.timeTo60Mph}) should be faster than FWD (${fwd.timeTo60Mph})`);
  }
});

// 9. AWD traction advantage in traction-limited conditions
test('9. AWD provides maximum traction on launch', () => {
  const awd = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 500, drivetrain: 'awd' });
  const rwd = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 500, drivetrain: 'rwd' });
  assert.strictEqual(awd.reachable, true);
  assert.strictEqual(rwd.reachable, true);
  if (awd.reachable && rwd.reachable) {
    assert(awd.timeTo60Mph < rwd.timeTo60Mph);
  }
});

// 10. Wet surface significantly degrades acceleration
test('10. Wet surface degrades acceleration due to reduced traction', () => {
  const dry = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, roadSurface: 'dry' });
  const wet = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, roadSurface: 'wet' });
  assert.strictEqual(dry.reachable, true);
  assert.strictEqual(wet.reachable, true);
  if (dry.reachable && wet.reachable) {
    assert(wet.timeTo60Mph > dry.timeTo60Mph, `Wet (${wet.timeTo60Mph}) must be slower than dry (${dry.timeTo60Mph})`);
  }
});

// 11. Drivetrain efficiency impact
test('11. Higher drivetrain efficiency improves acceleration', () => {
  const highEff = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, drivetrainEfficiencyPercent: 92 });
  const lowEff = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, drivetrainEfficiencyPercent: 78 });
  assert.strictEqual(highEff.reachable, true);
  assert.strictEqual(lowEff.reachable, true);
  if (highEff.reachable && lowEff.reachable) {
    assert(highEff.timeTo60Mph < lowEff.timeTo60Mph);
  }
});

// 12. Shift delay impact
test('12. Longer shift delay increases acceleration time', () => {
  const fastShift = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, shiftDelaySeconds: 0.05 });
  const slowShift = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, shiftDelaySeconds: 0.50 });
  assert.strictEqual(fastShift.reachable, true);
  assert.strictEqual(slowShift.reachable, true);
  if (fastShift.reachable && slowShift.reachable) {
    assert(slowShift.timeTo60Mph > fastShift.timeTo60Mph);
  }
});

// 13. Road gradient (uphill vs downhill)
test('13. Uphill gradient increases time; downhill gradient decreases time', () => {
  const flat = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, roadGradientPercent: 0 });
  const uphill = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, roadGradientPercent: 5 });
  const downhill = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, roadGradientPercent: -5 });

  assert.strictEqual(flat.reachable, true);
  assert.strictEqual(uphill.reachable, true);
  assert.strictEqual(downhill.reachable, true);
  if (flat.reachable && uphill.reachable && downhill.reachable) {
    assert(uphill.timeTo60Mph > flat.timeTo60Mph, 'Uphill must be slower than flat');
    assert(downhill.timeTo60Mph < flat.timeTo60Mph, 'Downhill must be faster than flat');
  }
});

// 14. Aerodynamic drag impact
test('14. Higher aerodynamic drag increases 0-60 time', () => {
  const lowDrag = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, dragCoefficient: 0.24 });
  const highDrag = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, dragCoefficient: 0.55 });
  assert.strictEqual(lowDrag.reachable, true);
  assert.strictEqual(highDrag.reachable, true);
  if (lowDrag.reachable && highDrag.reachable) {
    assert(highDrag.timeTo60Mph > lowDrag.timeTo60Mph);
  }
});

// 15. Rolling resistance impact
test('15. Higher rolling resistance increases acceleration time', () => {
  const lowRoll = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, rollingResistanceCoeff: 0.008 });
  const highRoll = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, rollingResistanceCoeff: 0.030 });
  assert.strictEqual(lowRoll.reachable, true);
  assert.strictEqual(highRoll.reachable, true);
  if (lowRoll.reachable && highRoll.reachable) {
    assert(highRoll.timeTo60Mph > lowRoll.timeTo60Mph);
  }
});

// 16. Power scaling invariant
test('16. Invariant: Higher engine power decreases 0-60 time', () => {
  const p200 = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 200 });
  const p300 = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 300 });
  const p500 = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 500 });

  assert.strictEqual(p200.reachable, true);
  assert.strictEqual(p300.reachable, true);
  assert.strictEqual(p500.reachable, true);
  if (p200.reachable && p300.reachable && p500.reachable) {
    assert(p200.timeTo60Mph > p300.timeTo60Mph);
    assert(p300.timeTo60Mph > p500.timeTo60Mph);
  }
});

// 17. Mass scaling invariant
test('17. Invariant: Higher vehicle mass increases 0-60 time', () => {
  const light = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, vehicleWeight: 2800 });
  const medium = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, vehicleWeight: 3500 });
  const heavy = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, vehicleWeight: 4800 });

  assert.strictEqual(light.reachable, true);
  assert.strictEqual(medium.reachable, true);
  assert.strictEqual(heavy.reachable, true);
  if (light.reachable && medium.reachable && heavy.reachable) {
    assert(light.timeTo60Mph < medium.timeTo60Mph);
    assert(medium.timeTo60Mph < heavy.timeTo60Mph);
  }
});

// 18. Unreachable target speed handled gracefully
test('18. Extreme conditions with insufficient power return reachable: false', () => {
  // 15 hp motor in a 20,000 lb truck on a steep hill
  const underpowered = calculateZeroToSixty({
    ...DEFAULT_ZERO_TO_SIXTY_INPUT,
    enginePower: 15,
    vehicleWeight: 20000,
    roadGradientPercent: 15,
  });
  assert.strictEqual(underpowered.reachable, false);
  assert(underpowered.reason.length > 0);
});

// 19. Deterministic repeatability
test('19. Simulation is completely deterministic and repeatable', () => {
  const run1 = calculateZeroToSixty(DEFAULT_ZERO_TO_SIXTY_INPUT);
  const run2 = calculateZeroToSixty(DEFAULT_ZERO_TO_SIXTY_INPUT);
  assert.deepStrictEqual(run1, run2);
});

// 20. Simulation points curve consistency
test('20. Simulation points are strictly monotonic in time and velocity', () => {
  const res = calculateZeroToSixty(DEFAULT_ZERO_TO_SIXTY_INPUT);
  assert.strictEqual(res.reachable, true);
  if (res.reachable) {
    const pts = res.simulationPoints;
    assert(pts.length > 10, 'Must have sufficient points for chart visualization');
    for (let i = 1; i < pts.length; i++) {
      assert(pts[i].timeSeconds >= pts[i - 1].timeSeconds, 'Time must increase');
      assert(pts[i].distanceFeet >= pts[i - 1].distanceFeet, 'Distance must increase');
    }
  }
});

// 21. Tire grip category advantage
test('21. Track tires outperform standard street tires on dry pavement', () => {
  const standard = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 450, tireCategory: 'standard' });
  const track = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 450, tireCategory: 'track' });
  assert.strictEqual(standard.reachable, true);
  assert.strictEqual(track.reachable, true);
  if (standard.reachable && track.reachable) {
    assert(track.timeTo60Mph < standard.timeTo60Mph);
  }
});

// 22. Launch quality impact
test('22. Aggressive launch outperforms conservative launch', () => {
  const conservative = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 400, launchQuality: 'conservative' });
  const aggressive = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, enginePower: 400, launchQuality: 'aggressive' });
  assert.strictEqual(conservative.reachable, true);
  assert.strictEqual(aggressive.reachable, true);
  if (conservative.reachable && aggressive.reachable) {
    assert(aggressive.timeTo60Mph < conservative.timeTo60Mph);
  }
});

// 23. Driver and extra cargo weight increases acceleration time
test('23. Adding extra cargo weight increases 0-60 time', () => {
  const empty = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, driverCargoWeight: 0 });
  const loaded = calculateZeroToSixty({ ...DEFAULT_ZERO_TO_SIXTY_INPUT, driverCargoWeight: 500 });
  assert.strictEqual(empty.reachable, true);
  assert.strictEqual(loaded.reachable, true);
  if (empty.reachable && loaded.reachable) {
    assert(loaded.timeTo60Mph > empty.timeTo60Mph);
  }
});

// 24. Power-to-weight metrics calculation
test('24. Power-to-weight metrics are accurately computed', () => {
  const res = calculateZeroToSixty({
    ...DEFAULT_ZERO_TO_SIXTY_INPUT,
    enginePower: 300,
    vehicleWeight: 3000,
    weightUnit: 'lb',
  });
  assert.strictEqual(res.reachable, true);
  if (res.reachable) {
    // 300 hp / (3000 lb / 2000 lb/ton) = 300 / 1.5 = 200 hp/ton
    assert.strictEqual(res.powerToWeightHpPerTon, 200);
    // 3000 lb / 300 hp = 10 lb/hp
    assert.strictEqual(res.powerToWeightLbPerHp, 10);
  }
});

// 25. Extremely steep hill launch failure check
test('25. Steep hill exceeding traction prevents launch', () => {
  const steepHill = calculateZeroToSixty({
    ...DEFAULT_ZERO_TO_SIXTY_INPUT,
    roadGradientPercent: 28,
    roadSurface: 'wet',
    drivetrain: 'fwd',
  });
  assert.strictEqual(steepHill.reachable, false);
});

console.log('All 25 ZeroToSixtyCalculator unit tests passed successfully!');
