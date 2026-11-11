import type { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../../utils/response';
import { listToolsQuerySchema, toolFieldsSchema } from '../../validation/admin-tool.schema';
import { createTool, deleteTool, getTool, listPlacement, listTools, updateTool } from './tool.service';

export async function getToolList(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await listTools(listToolsQuerySchema.parse(req.query)));
  } catch (error) {
    next(error);
  }
}

export async function getPlacement(_req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await listPlacement());
  } catch (error) {
    next(error);
  }
}

export async function getOneTool(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await getTool(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function postTool(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await createTool(toolFieldsSchema.parse(req.body)), 201);
  } catch (error) {
    next(error);
  }
}

export async function patchTool(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await updateTool(req.params.id, toolFieldsSchema.parse(req.body)));
  } catch (error) {
    next(error);
  }
}

export async function removeTool(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await deleteTool(req.params.id));
  } catch (error) {
    next(error);
  }
}
