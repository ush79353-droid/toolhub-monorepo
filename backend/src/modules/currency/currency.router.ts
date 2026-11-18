import { Router } from 'express';
import { sendSuccess } from '../../utils/response';
import { getCurrencyRatesSnapshot } from './currency.service';

export const currencyRouter = Router();

/**
 * GET /api/v1/currency/rates?base=USD
 * Public read of the latest stored CurrencyRate snapshot (ADR-017 / ADR-021).
 */
currencyRouter.get('/rates', async (req, res, next) => {
  try {
    const raw = typeof req.query.base === 'string' ? req.query.base : 'USD';
    sendSuccess(res, await getCurrencyRatesSnapshot(raw));
  } catch (error) {
    next(error);
  }
});
