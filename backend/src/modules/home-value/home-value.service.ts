import { AppError } from '../../middleware/error.middleware';
import { fetchFredCsvSeries } from './fred-csv';
import { HomeValueIndexCache } from './home-value-index.model';
import {
  CPI_SERIES,
  HOME_VALUE_METROS,
  findMetroById,
  type HomeValueMetroDefinition,
} from './metros';

/** Refresh cached FRED observations after this age (indices update monthly with lag). */
export const HOME_VALUE_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface HomeValueSeriesSnapshot {
  seriesKey: string;
  fredSeriesId: string;
  label: string;
  source: string;
  frequency: 'monthly';
  firstPeriod: string;
  latestPeriod: string;
  fetchedAt: string;
  observations: Array<{ period: string; value: number }>;
  stale: boolean;
}

export interface HomeValueMetroPublic {
  id: string;
  state: string;
  city: string;
  label: string;
  fredSeriesId: string;
  frequency: 'monthly';
  source: string;
  indexName: string;
  firstPeriod: string | null;
  latestPeriod: string | null;
}

function isFresh(fetchedAt: Date): boolean {
  return Date.now() - fetchedAt.getTime() < HOME_VALUE_CACHE_TTL_MS;
}

async function upsertSeries(params: {
  seriesKey: string;
  fredSeriesId: string;
  label: string;
  source: string;
}): Promise<HomeValueSeriesSnapshot> {
  const observations = await fetchFredCsvSeries(params.fredSeriesId);
  const firstPeriod = observations[0]!.period;
  const latestPeriod = observations[observations.length - 1]!.period;
  const fetchedAt = new Date();

  await HomeValueIndexCache.findOneAndUpdate(
    { seriesKey: params.seriesKey },
    {
      seriesKey: params.seriesKey,
      fredSeriesId: params.fredSeriesId,
      label: params.label,
      source: params.source,
      frequency: 'monthly',
      observations,
      firstPeriod,
      latestPeriod,
      fetchedAt,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    seriesKey: params.seriesKey,
    fredSeriesId: params.fredSeriesId,
    label: params.label,
    source: params.source,
    frequency: 'monthly',
    firstPeriod,
    latestPeriod,
    fetchedAt: fetchedAt.toISOString(),
    observations,
    stale: false,
  };
}

async function readCached(seriesKey: string): Promise<HomeValueSeriesSnapshot | null> {
  const doc = await HomeValueIndexCache.findOne({ seriesKey }).lean();
  if (!doc || !doc.observations?.length) return null;
  const stale = !isFresh(new Date(doc.fetchedAt));
  return {
    seriesKey: doc.seriesKey,
    fredSeriesId: doc.fredSeriesId,
    label: doc.label,
    source: doc.source,
    frequency: 'monthly',
    firstPeriod: doc.firstPeriod,
    latestPeriod: doc.latestPeriod,
    fetchedAt: new Date(doc.fetchedAt).toISOString(),
    observations: doc.observations.map((o) => ({
      period: o.period,
      value: o.value,
    })),
    stale,
  };
}

export async function getOrRefreshSeries(params: {
  seriesKey: string;
  fredSeriesId: string;
  label: string;
  source: string;
  forceRefresh?: boolean;
}): Promise<HomeValueSeriesSnapshot> {
  const cached = await readCached(params.seriesKey);
  if (cached && !cached.stale && !params.forceRefresh) {
    return cached;
  }

  try {
    return await upsertSeries(params);
  } catch (error) {
    // Serve stale cache if upstream fails
    if (cached) {
      return { ...cached, stale: true };
    }
    throw new AppError(
      error instanceof Error
        ? error.message
        : `Unable to load index series ${params.fredSeriesId}`,
      502,
      'HOME_VALUE_UPSTREAM_ERROR'
    );
  }
}

export async function listMetros(): Promise<HomeValueMetroPublic[]> {
  const coverage = await HomeValueIndexCache.find({
    seriesKey: { $in: HOME_VALUE_METROS.map((m) => `metro:${m.id}`) },
  })
    .select({ seriesKey: 1, firstPeriod: 1, latestPeriod: 1 })
    .lean();

  const byKey = new Map(
    coverage.map((c) => [c.seriesKey, c] as const)
  );

  return HOME_VALUE_METROS.map((m) => {
    const cached = byKey.get(`metro:${m.id}`);
    return {
      id: m.id,
      state: m.state,
      city: m.city,
      label: m.label,
      fredSeriesId: m.fredSeriesId,
      frequency: m.frequency,
      source: m.source,
      indexName: m.indexName,
      firstPeriod: cached?.firstPeriod ?? null,
      latestPeriod: cached?.latestPeriod ?? null,
    };
  });
}

export async function getMetroSeries(
  metroId: string,
  forceRefresh = false
): Promise<HomeValueSeriesSnapshot & { metro: HomeValueMetroDefinition }> {
  const metro = findMetroById(metroId);
  if (!metro) {
    throw new AppError(`Unsupported metro "${metroId}"`, 404, 'HOME_VALUE_METRO_NOT_FOUND');
  }
  const series = await getOrRefreshSeries({
    seriesKey: `metro:${metro.id}`,
    fredSeriesId: metro.fredSeriesId,
    label: metro.indexName,
    source: metro.source,
    forceRefresh,
  });
  return { ...series, metro };
}

export async function getCpiSeries(forceRefresh = false): Promise<HomeValueSeriesSnapshot> {
  return getOrRefreshSeries({
    seriesKey: `cpi:${CPI_SERIES.id}`,
    fredSeriesId: CPI_SERIES.fredSeriesId,
    label: CPI_SERIES.name,
    source: CPI_SERIES.source,
    forceRefresh,
  });
}

export async function getHomeValueBundle(
  metroId: string,
  forceRefresh = false
): Promise<{
  metro: HomeValueMetroDefinition;
  homePriceIndex: HomeValueSeriesSnapshot;
  cpi: HomeValueSeriesSnapshot;
}> {
  const [metroSeries, cpi] = await Promise.all([
    getMetroSeries(metroId, forceRefresh),
    getCpiSeries(forceRefresh),
  ]);
  const { metro, ...homePriceIndex } = metroSeries;
  return { metro, homePriceIndex, cpi };
}
