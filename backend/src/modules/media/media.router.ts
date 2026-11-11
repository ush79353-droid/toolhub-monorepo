import { Router } from 'express';
import { authenticateAdmin } from '../../middleware/auth.middleware';
import { getMediaList, postMedia, postMediaUploadUrl, removeMedia } from './media.controller';

export const mediaRouter = Router();

mediaRouter.use(authenticateAdmin);
mediaRouter.get('/', getMediaList);
mediaRouter.post('/upload-url', postMediaUploadUrl);
mediaRouter.post('/', postMedia);
mediaRouter.delete('/:id', removeMedia);
