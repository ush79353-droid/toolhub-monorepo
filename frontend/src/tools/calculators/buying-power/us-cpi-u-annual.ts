/**
 * US CPI-U annual averages (CUUR0000SA0), embedded for deterministic client calc.
 * Series: CPI-U, US City Average, All Items, NSA, annual average (1982-84=100).
 * Source: U.S. Bureau of Labor Statistics (BLS) — https://www.bls.gov/cpi/
 * Series ID: CUUR0000SA0
 * Retrieved: 2026-11-21 from BLS CPI supplemental annual-average table.
 * Do not invent values. Update by re-importing official BLS annual averages.
 */

export const US_CPI_SERIES_ID = 'CUUR0000SA0' as const;
export const US_CPI_SOURCE_NAME = 'U.S. Bureau of Labor Statistics (BLS)' as const;
export const US_CPI_SOURCE_URL = 'https://www.bls.gov/cpi/' as const;
export const US_CPI_CURRENCY = 'USD' as const;
export const US_CPI_COUNTRY = 'US' as const;
export const US_CPI_RETRIEVED_AT = '2026-11-21' as const;
export const US_CPI_BASE = '1982-84=100' as const;

export interface UsCpiAnnualRecord {
  year: number;
  annualAverageCPI: number;
  dataStatus: 'final';
}

/** Annual-average CPI-U values keyed by calendar year (final published averages). */
export const US_CPI_U_ANNUAL: ReadonlyArray<UsCpiAnnualRecord> = [
  { year: 1913, annualAverageCPI: 9.9, dataStatus: 'final' },
  { year: 1914, annualAverageCPI: 10, dataStatus: 'final' },
  { year: 1915, annualAverageCPI: 10.1, dataStatus: 'final' },
  { year: 1916, annualAverageCPI: 10.9, dataStatus: 'final' },
  { year: 1917, annualAverageCPI: 12.8, dataStatus: 'final' },
  { year: 1918, annualAverageCPI: 15.1, dataStatus: 'final' },
  { year: 1919, annualAverageCPI: 17.3, dataStatus: 'final' },
  { year: 1920, annualAverageCPI: 20, dataStatus: 'final' },
  { year: 1921, annualAverageCPI: 17.9, dataStatus: 'final' },
  { year: 1922, annualAverageCPI: 16.8, dataStatus: 'final' },
  { year: 1923, annualAverageCPI: 17.1, dataStatus: 'final' },
  { year: 1924, annualAverageCPI: 17.1, dataStatus: 'final' },
  { year: 1925, annualAverageCPI: 17.5, dataStatus: 'final' },
  { year: 1926, annualAverageCPI: 17.7, dataStatus: 'final' },
  { year: 1927, annualAverageCPI: 17.4, dataStatus: 'final' },
  { year: 1928, annualAverageCPI: 17.1, dataStatus: 'final' },
  { year: 1929, annualAverageCPI: 17.1, dataStatus: 'final' },
  { year: 1930, annualAverageCPI: 16.7, dataStatus: 'final' },
  { year: 1931, annualAverageCPI: 15.2, dataStatus: 'final' },
  { year: 1932, annualAverageCPI: 13.7, dataStatus: 'final' },
  { year: 1933, annualAverageCPI: 13, dataStatus: 'final' },
  { year: 1934, annualAverageCPI: 13.4, dataStatus: 'final' },
  { year: 1935, annualAverageCPI: 13.7, dataStatus: 'final' },
  { year: 1936, annualAverageCPI: 13.9, dataStatus: 'final' },
  { year: 1937, annualAverageCPI: 14.4, dataStatus: 'final' },
  { year: 1938, annualAverageCPI: 14.1, dataStatus: 'final' },
  { year: 1939, annualAverageCPI: 13.9, dataStatus: 'final' },
  { year: 1940, annualAverageCPI: 14, dataStatus: 'final' },
  { year: 1941, annualAverageCPI: 14.7, dataStatus: 'final' },
  { year: 1942, annualAverageCPI: 16.3, dataStatus: 'final' },
  { year: 1943, annualAverageCPI: 17.3, dataStatus: 'final' },
  { year: 1944, annualAverageCPI: 17.6, dataStatus: 'final' },
  { year: 1945, annualAverageCPI: 18, dataStatus: 'final' },
  { year: 1946, annualAverageCPI: 19.5, dataStatus: 'final' },
  { year: 1947, annualAverageCPI: 22.3, dataStatus: 'final' },
  { year: 1948, annualAverageCPI: 24.1, dataStatus: 'final' },
  { year: 1949, annualAverageCPI: 23.8, dataStatus: 'final' },
  { year: 1950, annualAverageCPI: 24.1, dataStatus: 'final' },
  { year: 1951, annualAverageCPI: 26, dataStatus: 'final' },
  { year: 1952, annualAverageCPI: 26.5, dataStatus: 'final' },
  { year: 1953, annualAverageCPI: 26.7, dataStatus: 'final' },
  { year: 1954, annualAverageCPI: 26.9, dataStatus: 'final' },
  { year: 1955, annualAverageCPI: 26.8, dataStatus: 'final' },
  { year: 1956, annualAverageCPI: 27.2, dataStatus: 'final' },
  { year: 1957, annualAverageCPI: 28.1, dataStatus: 'final' },
  { year: 1958, annualAverageCPI: 28.9, dataStatus: 'final' },
  { year: 1959, annualAverageCPI: 29.1, dataStatus: 'final' },
  { year: 1960, annualAverageCPI: 29.6, dataStatus: 'final' },
  { year: 1961, annualAverageCPI: 29.9, dataStatus: 'final' },
  { year: 1962, annualAverageCPI: 30.2, dataStatus: 'final' },
  { year: 1963, annualAverageCPI: 30.6, dataStatus: 'final' },
  { year: 1964, annualAverageCPI: 31, dataStatus: 'final' },
  { year: 1965, annualAverageCPI: 31.5, dataStatus: 'final' },
  { year: 1966, annualAverageCPI: 32.4, dataStatus: 'final' },
  { year: 1967, annualAverageCPI: 33.4, dataStatus: 'final' },
  { year: 1968, annualAverageCPI: 34.8, dataStatus: 'final' },
  { year: 1969, annualAverageCPI: 36.7, dataStatus: 'final' },
  { year: 1970, annualAverageCPI: 38.8, dataStatus: 'final' },
  { year: 1971, annualAverageCPI: 40.5, dataStatus: 'final' },
  { year: 1972, annualAverageCPI: 41.8, dataStatus: 'final' },
  { year: 1973, annualAverageCPI: 44.4, dataStatus: 'final' },
  { year: 1974, annualAverageCPI: 49.3, dataStatus: 'final' },
  { year: 1975, annualAverageCPI: 53.8, dataStatus: 'final' },
  { year: 1976, annualAverageCPI: 56.9, dataStatus: 'final' },
  { year: 1977, annualAverageCPI: 60.6, dataStatus: 'final' },
  { year: 1978, annualAverageCPI: 65.2, dataStatus: 'final' },
  { year: 1979, annualAverageCPI: 72.6, dataStatus: 'final' },
  { year: 1980, annualAverageCPI: 82.4, dataStatus: 'final' },
  { year: 1981, annualAverageCPI: 90.9, dataStatus: 'final' },
  { year: 1982, annualAverageCPI: 96.5, dataStatus: 'final' },
  { year: 1983, annualAverageCPI: 99.6, dataStatus: 'final' },
  { year: 1984, annualAverageCPI: 103.9, dataStatus: 'final' },
  { year: 1985, annualAverageCPI: 107.6, dataStatus: 'final' },
  { year: 1986, annualAverageCPI: 109.6, dataStatus: 'final' },
  { year: 1987, annualAverageCPI: 113.6, dataStatus: 'final' },
  { year: 1988, annualAverageCPI: 118.3, dataStatus: 'final' },
  { year: 1989, annualAverageCPI: 124, dataStatus: 'final' },
  { year: 1990, annualAverageCPI: 130.7, dataStatus: 'final' },
  { year: 1991, annualAverageCPI: 136.2, dataStatus: 'final' },
  { year: 1992, annualAverageCPI: 140.3, dataStatus: 'final' },
  { year: 1993, annualAverageCPI: 144.5, dataStatus: 'final' },
  { year: 1994, annualAverageCPI: 148.2, dataStatus: 'final' },
  { year: 1995, annualAverageCPI: 152.4, dataStatus: 'final' },
  { year: 1996, annualAverageCPI: 156.9, dataStatus: 'final' },
  { year: 1997, annualAverageCPI: 160.5, dataStatus: 'final' },
  { year: 1998, annualAverageCPI: 163, dataStatus: 'final' },
  { year: 1999, annualAverageCPI: 166.6, dataStatus: 'final' },
  { year: 2000, annualAverageCPI: 172.2, dataStatus: 'final' },
  { year: 2001, annualAverageCPI: 177.1, dataStatus: 'final' },
  { year: 2002, annualAverageCPI: 179.9, dataStatus: 'final' },
  { year: 2003, annualAverageCPI: 184, dataStatus: 'final' },
  { year: 2004, annualAverageCPI: 188.9, dataStatus: 'final' },
  { year: 2005, annualAverageCPI: 195.3, dataStatus: 'final' },
  { year: 2006, annualAverageCPI: 201.6, dataStatus: 'final' },
  { year: 2007, annualAverageCPI: 207.342, dataStatus: 'final' },
  { year: 2008, annualAverageCPI: 215.303, dataStatus: 'final' },
  { year: 2009, annualAverageCPI: 214.537, dataStatus: 'final' },
  { year: 2010, annualAverageCPI: 218.056, dataStatus: 'final' },
  { year: 2011, annualAverageCPI: 224.939, dataStatus: 'final' },
  { year: 2012, annualAverageCPI: 229.594, dataStatus: 'final' },
  { year: 2013, annualAverageCPI: 232.957, dataStatus: 'final' },
  { year: 2014, annualAverageCPI: 236.736, dataStatus: 'final' },
  { year: 2015, annualAverageCPI: 237.017, dataStatus: 'final' },
  { year: 2016, annualAverageCPI: 240.007, dataStatus: 'final' },
  { year: 2017, annualAverageCPI: 245.12, dataStatus: 'final' },
  { year: 2018, annualAverageCPI: 251.107, dataStatus: 'final' },
  { year: 2019, annualAverageCPI: 255.657, dataStatus: 'final' },
  { year: 2020, annualAverageCPI: 258.811, dataStatus: 'final' },
  { year: 2021, annualAverageCPI: 270.97, dataStatus: 'final' },
  { year: 2022, annualAverageCPI: 292.655, dataStatus: 'final' },
  { year: 2023, annualAverageCPI: 304.702, dataStatus: 'final' },
  { year: 2024, annualAverageCPI: 313.689, dataStatus: 'final' },
  { year: 2025, annualAverageCPI: 321.943, dataStatus: 'final' },
];

const byYear = new Map<number, UsCpiAnnualRecord>(
  US_CPI_U_ANNUAL.map((row) => [row.year, row])
);

export const US_CPI_MIN_YEAR = US_CPI_U_ANNUAL[0]!.year;
export const US_CPI_MAX_YEAR = US_CPI_U_ANNUAL[US_CPI_U_ANNUAL.length - 1]!.year;

export function getUsCpiForYear(year: number): UsCpiAnnualRecord | null {
  return byYear.get(year) ?? null;
}

export function listUsCpiYearsDescending(): number[] {
  return US_CPI_U_ANNUAL.map((r) => r.year).slice().reverse();
}
