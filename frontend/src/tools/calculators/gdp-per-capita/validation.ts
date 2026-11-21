import {
  calculateGDP,
  calculateGDPPerCapita,
  calculatePopulation,
  displayFromGdpBase,
  displayFromPopulationBase,
  formatGdpAmount,
  formatMoneyPerPerson,
  formatPopulation,
  measureLabel,
  measureNote,
  toGdpBase,
  toPopulationBase,
} from './calculation';
import type {
  GdpMagnitude,
  GdpPerCapitaFieldErrors,
  GdpPerCapitaInput,
  GdpPerCapitaMode,
  GdpPerCapitaResult,
  PopulationMagnitude,
} from './types';

export interface GdpPerCapitaValidation {
  isValid: boolean;
  errors: GdpPerCapitaFieldErrors;
  result: GdpPerCapitaResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateGdpPerCapitaInput(
  input: GdpPerCapitaInput
): GdpPerCapitaValidation {
  const errors: GdpPerCapitaFieldErrors = {};
  const mode: GdpPerCapitaMode = input.mode;

  const gdp = parseNumber(input.gdp);
  const pop = parseNumber(input.population);
  const pc = parseNumber(input.gdpPerCapita);

  let gdpBase: number | null = null;
  let populationBase: number | null = null;
  let gdpPerCapita: number | null = null;

  if (mode === 'perCapita') {
    if (gdp.blank || gdp.invalid || gdp.value == null) {
      errors.gdp = 'Enter a valid GDP greater than zero.';
    } else if (gdp.value <= 0) {
      errors.gdp = 'GDP must be greater than zero.';
    } else {
      gdpBase = toGdpBase(gdp.value, input.gdpMagnitude);
    }

    if (pop.blank || pop.invalid || pop.value == null) {
      errors.population = 'Enter a valid population greater than zero.';
    } else if (pop.value <= 0) {
      errors.population = 'Population must be greater than zero.';
    } else {
      populationBase = toPopulationBase(pop.value, input.populationMagnitude);
    }
  } else if (mode === 'gdp') {
    if (pop.blank || pop.invalid || pop.value == null) {
      errors.population = 'Enter a valid population greater than zero.';
    } else if (pop.value <= 0) {
      errors.population = 'Population must be greater than zero.';
    } else {
      populationBase = toPopulationBase(pop.value, input.populationMagnitude);
    }

    if (pc.blank || pc.invalid || pc.value == null) {
      errors.gdpPerCapita = 'Enter a valid GDP per capita greater than zero.';
    } else if (pc.value <= 0) {
      errors.gdpPerCapita = 'GDP per capita must be greater than zero.';
    } else {
      gdpPerCapita = pc.value;
    }
  } else {
    if (gdp.blank || gdp.invalid || gdp.value == null) {
      errors.gdp = 'Enter a valid GDP greater than zero.';
    } else if (gdp.value <= 0) {
      errors.gdp = 'GDP must be greater than zero.';
    } else {
      gdpBase = toGdpBase(gdp.value, input.gdpMagnitude);
    }

    if (pc.blank || pc.invalid || pc.value == null) {
      errors.gdpPerCapita = 'Enter a valid GDP per capita greater than zero.';
    } else if (pc.value <= 0) {
      errors.gdpPerCapita = 'GDP per capita must be greater than zero.';
    } else {
      gdpPerCapita = pc.value;
    }
  }

  if (errors.gdp || errors.population || errors.gdpPerCapita) {
    return { isValid: false, errors, result: null };
  }

  try {
    if (mode === 'perCapita') {
      gdpPerCapita = calculateGDPPerCapita(gdpBase!, populationBase!);
    } else if (mode === 'gdp') {
      gdpBase = calculateGDP(gdpPerCapita!, populationBase!);
    } else {
      populationBase = calculatePopulation(gdpBase!, gdpPerCapita!);
    }
  } catch (e) {
    errors.form =
      e instanceof Error ? e.message : 'Unable to calculate GDP per capita.';
    return { isValid: false, errors, result: null };
  }

  const outMagGdp: GdpMagnitude =
    mode === 'gdp' ? 'trillions' : input.gdpMagnitude;
  // Prefer user's GDP magnitude when computing GDP; for reverse GDP use trillions if large
  const gdpDisplayMag: GdpMagnitude =
    mode === 'gdp'
      ? gdpBase! >= 1_000_000_000_000
        ? 'trillions'
        : gdpBase! >= 1_000_000_000
          ? 'billions'
          : gdpBase! >= 1_000_000
            ? 'millions'
            : 'units'
      : input.gdpMagnitude;

  const popDisplayMag: PopulationMagnitude =
    mode === 'population'
      ? populationBase! >= 1_000_000_000
        ? 'billions'
        : populationBase! >= 1_000_000
          ? 'millions'
          : populationBase! >= 1_000
            ? 'thousands'
            : 'people'
      : input.populationMagnitude;

  void outMagGdp;

  const title = measureLabel(input.measureType);
  const steps: string[] = [];
  if (mode === 'perCapita') {
    steps.push(
      `Identify GDP = ${formatGdpAmount(gdpBase!, input.currency, gdpDisplayMag)}.`
    );
    steps.push(
      `Identify Population = ${formatPopulation(populationBase!, popDisplayMag)}.`
    );
    steps.push('Apply GDPpc = GDP / Population.');
    steps.push(
      `Calculate GDPpc = ${formatMoneyPerPerson(gdpPerCapita!, input.currency)}.`
    );
  } else if (mode === 'gdp') {
    steps.push(
      `Identify Population = ${formatPopulation(populationBase!, popDisplayMag)}.`
    );
    steps.push(
      `Identify GDP per Capita = ${formatMoneyPerPerson(gdpPerCapita!, input.currency)}.`
    );
    steps.push('Apply GDP = GDPpc × Population.');
    steps.push(
      `Calculate GDP = ${formatGdpAmount(gdpBase!, input.currency, gdpDisplayMag)}.`
    );
  } else {
    steps.push(
      `Identify GDP = ${formatGdpAmount(gdpBase!, input.currency, gdpDisplayMag)}.`
    );
    steps.push(
      `Identify GDP per Capita = ${formatMoneyPerPerson(gdpPerCapita!, input.currency)}.`
    );
    steps.push('Apply Population = GDP / GDPpc.');
    steps.push(
      `Calculate Population = ${formatPopulation(populationBase!, popDisplayMag)}.`
    );
  }

  const formulaBreakdown =
    mode === 'perCapita'
      ? `GDPpc = GDP / Population = ${formatMoneyPerPerson(gdpPerCapita!, input.currency)}`
      : mode === 'gdp'
        ? `GDP = GDPpc × Population`
        : `Population = GDP / GDPpc`;

  const result: GdpPerCapitaResult = {
    mode,
    currency: input.currency,
    gdpBase: gdpBase!,
    populationBase: populationBase!,
    gdpPerCapita: gdpPerCapita!,
    formattedGdp: formatGdpAmount(gdpBase!, input.currency, gdpDisplayMag),
    formattedPopulation: formatPopulation(populationBase!, popDisplayMag),
    formattedPerCapita: formatMoneyPerPerson(gdpPerCapita!, input.currency),
    displayGdp: displayFromGdpBase(gdpBase!, gdpDisplayMag),
    displayPopulation: displayFromPopulationBase(
      populationBase!,
      popDisplayMag
    ),
    displayPerCapita: new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(gdpPerCapita!),
    measureLabel: title,
    resultTitle: title,
    interpretation: `With GDP of ${formatGdpAmount(gdpBase!, input.currency, gdpDisplayMag)} and population of ${formatPopulation(populationBase!, popDisplayMag)}, the economy produces approximately ${formatMoneyPerPerson(gdpPerCapita!, input.currency)}. GDP per capita is an average economic output measure and does not represent the income earned by every resident. ${measureNote(input.measureType)}`,
    formulaBreakdown,
    steps,
    explanation:
      'GDP per capita is average output per person; not median income, wages, or wealth. Keep GDP measure (real/nominal/PPP), geography, and period consistent.',
  };

  return { isValid: true, errors, result };
}
