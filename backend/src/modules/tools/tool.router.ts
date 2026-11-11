import { Router } from 'express';
import { authenticateAdmin } from '../../middleware/auth.middleware';
import { getOneTool, getPlacement, getToolList, patchTool, postTool, removeTool } from './tool.controller';

export const toolRouter = Router();

toolRouter.use(authenticateAdmin);
toolRouter.get('/', getToolList);
toolRouter.get('/placement', getPlacement);
toolRouter.get('/:id', getOneTool);
toolRouter.post('/', postTool);
toolRouter.patch('/:id', patchTool);
toolRouter.delete('/:id', removeTool);
