import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';
import { createCategorySchema, listCategoriesQuerySchema, updateCategorySchema } from '../../validation/category.schema';
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  listParentOptions,
  updateCategory,
} from './category.service';

export async function getCategoryList(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listCategoriesQuerySchema.parse(req.query);
    const result = await listCategories(query);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getParentOptions(_req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await listParentOptions());
  } catch (error) {
    next(error);
  }
}

export async function getOneCategory(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await getCategory(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function postCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createCategorySchema.parse(req.body);
    const created = await createCategory(input);
    sendSuccess(res, created, 201);
  } catch (error) {
    next(error instanceof ZodError ? error : error);
  }
}

export async function patchCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateCategorySchema.parse(req.body);
    const updated = await updateCategory(req.params.id, input);
    sendSuccess(res, updated);
  } catch (error) {
    if (error instanceof ZodError) return next(error);
    next(error);
  }
}

export async function removeCategory(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.params.id) throw new AppError('Category id is required', 400, 'VALIDATION_ERROR');
    const result = await deleteCategory(req.params.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
