import { Router } from 'express';
import { sendSuccess } from '../../utils/response';
import {
  getCpiSeries,
  getHomeValueBundle,
  getMetroSeries,
  listMetros,
} from './home-value.service';
import { CPI_SERIES, HOME_VALUE_METROS } from './metros';

export const homeValueRouter = Router();

/**
 * GET /api/v1/home-value/metros
 * Catalog of supported Case-Shiller metros (coverage from cache when present).
 */
homeValueRouter.get('/metros', async (_req, res, next) => {
  try {
    sendSuccess(res, {
      metros: await listMetros(),
      cpi: {
        id: CPI_SERIES.id,
        fredSeriesId: CPI_SERIES.fredSeriesId,
        name: CPI_SERIES.name,
        source: CPI_SERIES.source,
        frequency: CPI_SERIES.frequency,
      },
      providerNote:
        'Home price indices: S&P CoreLogic Case-Shiller via FRED. Inflation: CPI-U (NSA, CPIAUCNS) via FRED / BLS.',
      supportedCount: HOME_VALUE_METROS.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/home-value/series/:metroId
 * Cached Case-Shiller observations for one metro (+ optional force refresh).
 */
homeValueRouter.get('/series/:metroId', async (req, res, next) => {
  try {
    const force = req.query.refresh === '1' || req.query.refresh === 'true';
    sendSuccess(res, await getMetroSeries(req.params.metroId, force));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/home-value/cpi
 */
homeValueRouter.get('/cpi', async (req, res, next) => {
  try {
    const force = req.query.refresh === '1' || req.query.refresh === 'true';
    sendSuccess(res, await getCpiSeries(force));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/home-value/bundle/:metroId
 * Metro HPI + CPI in one response for the calculator.
 */
homeValueRouter.get('/bundle/:metroId', async (req, res, next) => {
  try {
    const force = req.query.refresh === '1' || req.query.refresh === 'true';
    sendSuccess(res, await getHomeValueBundle(req.params.metroId, force));
  } catch (error) {
    next(error);
  }
});
