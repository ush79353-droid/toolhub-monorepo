/**
 * S&P CoreLogic Case-Shiller metro series as published on FRED (NSA, monthly).
 * Series IDs verified against fred.stlouisfed.org CSV endpoints.
 * Source attribution: S&P Dow Jones Indices LLC / FRED, Federal Reserve Bank of St. Louis.
 */

export interface HomeValueMetroDefinition {
  id: string;
  state: string;
  city: string;
  label: string;
  fredSeriesId: string;
  frequency: 'monthly';
  source: string;
  indexName: string;
}

export const HOME_VALUE_METROS: readonly HomeValueMetroDefinition[] = [
  {
    id: 'phoenix',
    state: 'AZ',
    city: 'Phoenix',
    label: 'AZ - Phoenix',
    fredSeriesId: 'PHXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller AZ-Phoenix Home Price Index (NSA)',
  },
  {
    id: 'los-angeles',
    state: 'CA',
    city: 'Los Angeles',
    label: 'CA - Los Angeles',
    fredSeriesId: 'LXXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller CA-Los Angeles Home Price Index (NSA)',
  },
  {
    id: 'san-diego',
    state: 'CA',
    city: 'San Diego',
    label: 'CA - San Diego',
    fredSeriesId: 'SDXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller CA-San Diego Home Price Index (NSA)',
  },
  {
    id: 'san-francisco',
    state: 'CA',
    city: 'San Francisco',
    label: 'CA - San Francisco',
    fredSeriesId: 'SFXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller CA-San Francisco Home Price Index (NSA)',
  },
  {
    id: 'denver',
    state: 'CO',
    city: 'Denver',
    label: 'CO - Denver',
    fredSeriesId: 'DNXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller CO-Denver Home Price Index (NSA)',
  },
  {
    id: 'washington',
    state: 'DC',
    city: 'Washington',
    label: 'DC - Washington',
    fredSeriesId: 'WDXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller DC-Washington Home Price Index (NSA)',
  },
  {
    id: 'miami',
    state: 'FL',
    city: 'Miami',
    label: 'FL - Miami',
    fredSeriesId: 'MIXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller FL-Miami Home Price Index (NSA)',
  },
  {
    id: 'tampa',
    state: 'FL',
    city: 'Tampa',
    label: 'FL - Tampa',
    fredSeriesId: 'TPXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller FL-Tampa Home Price Index (NSA)',
  },
  {
    id: 'atlanta',
    state: 'GA',
    city: 'Atlanta',
    label: 'GA - Atlanta',
    fredSeriesId: 'ATXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller GA-Atlanta Home Price Index (NSA)',
  },
  {
    id: 'chicago',
    state: 'IL',
    city: 'Chicago',
    label: 'IL - Chicago',
    fredSeriesId: 'CHXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller IL-Chicago Home Price Index (NSA)',
  },
  {
    id: 'boston',
    state: 'MA',
    city: 'Boston',
    label: 'MA - Boston',
    fredSeriesId: 'BOXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller MA-Boston Home Price Index (NSA)',
  },
  {
    id: 'detroit',
    state: 'MI',
    city: 'Detroit',
    label: 'MI - Detroit',
    fredSeriesId: 'DEXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller MI-Detroit Home Price Index (NSA)',
  },
  {
    id: 'minneapolis',
    state: 'MN',
    city: 'Minneapolis',
    label: 'MN - Minneapolis',
    fredSeriesId: 'MNXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller MN-Minneapolis Home Price Index (NSA)',
  },
  {
    id: 'charlotte',
    state: 'NC',
    city: 'Charlotte',
    label: 'NC - Charlotte',
    fredSeriesId: 'CRXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller NC-Charlotte Home Price Index (NSA)',
  },
  {
    id: 'las-vegas',
    state: 'NV',
    city: 'Las Vegas',
    label: 'NV - Las Vegas',
    fredSeriesId: 'LVXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller NV-Las Vegas Home Price Index (NSA)',
  },
  {
    id: 'new-york',
    state: 'NY',
    city: 'New York',
    label: 'NY - New York',
    fredSeriesId: 'NYXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller NY-New York Home Price Index (NSA)',
  },
  {
    id: 'cleveland',
    state: 'OH',
    city: 'Cleveland',
    label: 'OH - Cleveland',
    fredSeriesId: 'CEXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller OH-Cleveland Home Price Index (NSA)',
  },
  {
    id: 'portland',
    state: 'OR',
    city: 'Portland',
    label: 'OR - Portland',
    fredSeriesId: 'POXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller OR-Portland Home Price Index (NSA)',
  },
  {
    id: 'dallas',
    state: 'TX',
    city: 'Dallas',
    label: 'TX - Dallas',
    fredSeriesId: 'DAXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller TX-Dallas Home Price Index (NSA)',
  },
  {
    id: 'seattle',
    state: 'WA',
    city: 'Seattle',
    label: 'WA - Seattle',
    fredSeriesId: 'SEXRNSA',
    frequency: 'monthly',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    indexName: 'S&P CoreLogic Case-Shiller WA-Seattle Home Price Index (NSA)',
  },
] as const;

/** CPI-U (NSA) — aligns with Case-Shiller NSA metro series frequency. */
export const CPI_SERIES = {
  id: 'cpi-u-nsa',
  fredSeriesId: 'CPIAUCNS',
  name: 'Consumer Price Index for All Urban Consumers: All Items (CPI-U, NSA)',
  source: 'FRED / U.S. Bureau of Labor Statistics',
  frequency: 'monthly' as const,
};

export function findMetroById(id: string): HomeValueMetroDefinition | undefined {
  return HOME_VALUE_METROS.find((m) => m.id === id);
}

export function findMetroByFredSeries(seriesId: string): HomeValueMetroDefinition | undefined {
  return HOME_VALUE_METROS.find((m) => m.fredSeriesId === seriesId);
}
