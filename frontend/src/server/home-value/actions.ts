'use server';

import { serverApi } from '@/server/api/client';
import type {
  HomeValueMetroOption,
  IndexSeriesSnapshot,
} from '@/tools/calculators/home-value-us/types';

export interface HomeValueMetrosResponse {
  metros: HomeValueMetroOption[];
  cpi: {
    id: string;
    fredSeriesId: string;
    name: string;
    source: string;
    frequency: 'monthly';
  };
  providerNote: string;
  supportedCount: number;
}

export interface HomeValueBundleResponse {
  metro: {
    id: string;
    state: string;
    city: string;
    label: string;
    fredSeriesId: string;
    frequency: 'monthly';
    source: string;
    indexName: string;
  };
  homePriceIndex: IndexSeriesSnapshot;
  cpi: IndexSeriesSnapshot;
}

export async function fetchHomeValueMetros(): Promise<
  | { ok: true; data: HomeValueMetrosResponse }
  | { ok: false; message: string }
> {
  try {
    const response = await serverApi.get<HomeValueMetrosResponse>(
      '/home-value/metros',
      { cache: 'no-store', timeoutMs: 20_000 }
    );
    if (!response.success || !response.data) {
      return {
        ok: false,
        message: response.error?.message ?? 'Unable to load metro catalog.',
      };
    }
    return { ok: true, data: response.data };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to load metro catalog.',
    };
  }
}

export async function fetchHomeValueBundle(
  metroId: string,
  refresh = false
): Promise<
  | { ok: true; data: HomeValueBundleResponse; requestId: string }
  | { ok: false; message: string; requestId: string }
> {
  const requestId = `${metroId}:${Date.now()}`;
  try {
    const response = await serverApi.get<HomeValueBundleResponse>(
      `/home-value/bundle/${encodeURIComponent(metroId)}`,
      {
        cache: 'no-store',
        timeoutMs: 45_000,
        params: refresh ? { refresh: '1' } : undefined,
      }
    );
    if (!response.success || !response.data) {
      return {
        ok: false,
        message:
          response.error?.message ??
          'Unable to load home price index observations.',
        requestId,
      };
    }
    return { ok: true, data: response.data, requestId };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to load home price index observations.',
      requestId,
    };
  }
}
