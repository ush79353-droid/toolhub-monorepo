import type { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../../utils/response';
import { confirmMediaSchema, listMediaQuerySchema, signMediaSchema } from '../../validation/media.schema';
import { confirmMediaUpload, createMediaUpload, deleteMedia, listMedia } from './media.service';

export async function getMediaList(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await listMedia(listMediaQuerySchema.parse(req.query)));
  } catch (error) {
    next(error);
  }
}

export async function postMediaUploadUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await createMediaUpload(signMediaSchema.parse(req.body));
    sendSuccess(res, created, 201);
  } catch (error) {
    next(error);
  }
}

export async function postMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await confirmMediaUpload(confirmMediaSchema.parse(req.body));
    sendSuccess(res, created, 201);
  } catch (error) {
    next(error);
  }
}

export async function removeMedia(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await deleteMedia(req.params.id));
  } catch (error) {
    next(error);
  }
}
