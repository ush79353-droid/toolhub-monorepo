import { Router } from 'express';
import { sendSuccess } from '../../utils/response';
import {
  getPublicCategoryBySlug,
  getPublicToolBySlug,
  listFeaturedTools,
  listPublicCategories,
  listPublicTools,
} from './catalog.service';

export const catalogRouter = Router();


catalogRouter.get('/categories', async (_req, res, next) => {
  try {
    sendSuccess(res, await listPublicCategories());
  } catch (error) {
    next(error);
  }
});

catalogRouter.get('/categories/:slug', async (req, res, next) => {
  try {
    sendSuccess(res, await getPublicCategoryBySlug(req.params.slug));
  } catch (error) {
    next(error);
  }
});

catalogRouter.get('/featured', async (_req, res, next) => {
  try {
    sendSuccess(res, await listFeaturedTools());
  } catch (error) {
    next(error);
  }
});

catalogRouter.get('/tools', async (req, res, next) => {
  try {
    sendSuccess(res, await listPublicTools(req.query));
  } catch (error) {
    next(error);
  }
});

catalogRouter.get('/tools/:slug', async (req, res, next) => {
  try {
    sendSuccess(res, await getPublicToolBySlug(req.params.slug));
  } catch (error) {
    next(error);
  }
});
