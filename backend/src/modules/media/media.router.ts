import express, { Router } from 'express';
import { authenticateAdmin } from '../../middleware/auth.middleware';
import { getMediaList, postMedia, postMediaUploadUrl, putMediaObject, removeMedia } from './media.controller';

export const mediaRouter = Router();

mediaRouter.use(authenticateAdmin);
mediaRouter.get('/', getMediaList);
mediaRouter.post('/upload-url', postMediaUploadUrl);
mediaRouter.put('/object', express.raw({ type: '*/*', limit: '10mb' }), putMediaObject);
mediaRouter.post('/', postMedia);
mediaRouter.delete('/:id', removeMedia);
