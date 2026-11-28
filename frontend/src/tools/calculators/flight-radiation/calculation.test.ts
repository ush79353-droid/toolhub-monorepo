import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateFlightRadiationDose,
  calculateFlightRadiationFromInput,
  fromMicrosieverts,
  toHours,
  toMicrosieverts,
  toUSvPerHour,
} from './calculation';
import { createEmptyInput, createExampleShortFlight } from './types';
import { validateFlightRadiationInputs } from './validation';

describe('Flight Radiation Calculator engine', () => {
  it('3 h · 0.003 mSv/h → 0.009 mSv', () => {
    const input = createExampleShortFlight();
    const r = calculateFlightRadiationFromInput(input)!;
    assert.ok(Math.abs(fromMicrosieverts(r.doseMicrosieverts, 'mSv') - 0.009) < 1e-12);
  });

  it('8 h · 0.003 mSv/h → 0.024 mSv', () => {
    const r = calculateFlightRadiationFromInput(createEmptyInput())!;
    assert.ok(Math.abs(fromMicrosieverts(r.doseMicrosieverts, 'mSv') - 0.024) < 1e-12);
  });

  it('12 h · 0.003 mSv/h → 0.036 mSv', () => {
    const input = createEmptyInput();
    input.flightDuration = '12';
    const r = calculateFlightRadiationFromInput(input)!;
    assert.ok(Math.abs(fromMicrosieverts(r.doseMicrosieverts, 'mSv') - 0.036) < 1e-12);
  });

  it('5 h · 3 µSv/h → 15 µSv', () => {
    assert.equal(calculateFlightRadiationDose(5, 3), 15);
  });

  it('10 h · 5 µSv/h → 50 µSv', () => {
    assert.equal(calculateFlightRadiationDose(10, 5), 50);
  });

  it('60 min · 3 µSv/h → 3 µSv', () => {
    assert.equal(calculateFlightRadiationDose(toHours(60, 'min'), 3), 3);
  });

  it('30 min · 3 µSv/h → 1.5 µSv', () => {
    assert.equal(calculateFlightRadiationDose(toHours(30, 'min'), 3), 1.5);
  });

  it('0 h → 0 µSv', () => {
    assert.equal(calculateFlightRadiationDose(0, 3), 0);
  });

  it('0 rate → 0 µSv', () => {
    assert.equal(calculateFlightRadiationDose(8, 0), 0);
  });

  it('1 mSv = 1000 µSv', () => {
    assert.equal(toMicrosieverts(1, 'mSv'), 1000);
  });

  it('1 Sv = 1000 mSv', () => {
    assert.equal(fromMicrosieverts(toMicrosieverts(1, 'Sv'), 'mSv'), 1000);
  });

  it('1 rem = 10 mSv', () => {
    assert.equal(fromMicrosieverts(toMicrosieverts(1, 'rem'), 'mSv'), 10);
  });

  it('1 mrem = 10 µSv', () => {
    assert.equal(toMicrosieverts(1, 'mrem'), 10);
  });

  it('0.003 mSv/h = 3 µSv/h', () => {
    assert.equal(toUSvPerHour(0.003, 'mSv/h'), 3);
  });

  it('10 flights cumulative', () => {
    const input = createEmptyInput();
    input.numberOfFlights = '10';
    const r = calculateFlightRadiationFromInput(input)!;
    assert.ok(Math.abs(fromMicrosieverts(r.doseMicrosieverts, 'mSv') - 0.24) < 1e-12);
  });

  it('negative duration validation', () => {
    const input = createEmptyInput();
    input.flightDuration = '-1';
    assert.ok(validateFlightRadiationInputs(input).errors.flightDuration);
  });

  it('negative dose rate validation', () => {
    const input = createEmptyInput();
    input.doseRate = '-1';
    assert.ok(validateFlightRadiationInputs(input).errors.doseRate);
  });

  it('fractional flights validation', () => {
    const input = createEmptyInput();
    input.numberOfFlights = '1.5';
    assert.ok(validateFlightRadiationInputs(input).errors.numberOfFlights);
  });
});
