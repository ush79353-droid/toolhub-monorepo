import type { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../../utils/response';
import { confirmMediaSchema, listMediaQuerySchema, signMediaSchema } from '../../validation/media.schema';
import { saveUploadedObject } from '../../services/storage';
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

export async function putMediaObject(req: Request, res: Response, next: NextFunction) {
  try {
    const key = typeof req.query.key === 'string' ? req.query.key : '';
    const contentType = String(req.headers['content-type'] || '').split(';')[0];
    const body = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    sendSuccess(res, await saveUploadedObject({ key, contentType, body }));
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
