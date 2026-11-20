export interface FredObservation {
  /** YYYY-MM */
  period: string;
  value: number;
}

const FRED_CSV_URL = 'https://fred.stlouisfed.org/graph/fredgraph.csv';

function toPeriod(dateIso: string): string | null {
  // observation_date is YYYY-MM-DD — keep calendar month without timezone shift
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(dateIso.trim());
  if (!match) return null;
  return `${match[1]}-${match[2]}`;
}

/**
 * Fetch a public FRED series as CSV (no API key required for this endpoint).
 * Observations with missing values (".") are skipped.
 */
export async function fetchFredCsvSeries(
  fredSeriesId: string,
  timeoutMs = 30_000
): Promise<FredObservation[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `${FRED_CSV_URL}?id=${encodeURIComponent(fredSeriesId)}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'text/csv' },
    });
    if (!response.ok) {
      throw new Error(`FRED CSV request failed for ${fredSeriesId}: HTTP ${response.status}`);
    }
    const text = await response.text();
    if (!text.startsWith('observation_date')) {
      throw new Error(`Unexpected FRED CSV payload for ${fredSeriesId}`);
    }

    const observations: FredObservation[] = [];
    const lines = text.trim().split(/\r?\n/);
    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i]?.trim();
      if (!line) continue;
      const comma = line.indexOf(',');
      if (comma < 0) continue;
      const datePart = line.slice(0, comma).trim();
      const valuePart = line.slice(comma + 1).trim();
      if (!valuePart || valuePart === '.') continue;
      const value = Number(valuePart);
      if (!Number.isFinite(value) || value <= 0) continue;
      const period = toPeriod(datePart);
      if (!period) continue;
      observations.push({ period, value });
    }

    if (observations.length === 0) {
      throw new Error(`No valid observations returned for ${fredSeriesId}`);
    }
    return observations;
  } finally {
    clearTimeout(timer);
  }
}
