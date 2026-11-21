/**
 * Reuses the verified Savings Calculator compound-interest engine
 * (`../savings/calculation`) so Simple Savings stays in formula lockstep.
 */
export {
  apyToNominal,
  calculateSavings as calculateSimpleSavings,
  compoundPeriodsPerYear,
  depositPeriodsPerYear,
  nominalToApy,
  simulateSavings,
} from '../savings/calculation';
