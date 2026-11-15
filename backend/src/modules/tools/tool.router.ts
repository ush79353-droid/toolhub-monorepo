import { Router } from 'express';
import { authenticateAdmin } from '../../middleware/auth.middleware';
import { getAuditCatalog, getStoredAudit, postDevelopmentAudit } from './tool-audit.controller';
import { getOneTool, getPlacement, getToolList, patchTool, postTool, removeTool } from './tool.controller';

export const toolRouter = Router();

toolRouter.use(authenticateAdmin);
toolRouter.get('/', getToolList);
toolRouter.get('/placement', getPlacement);
toolRouter.get('/development-audit/catalog', getAuditCatalog);
toolRouter.get('/development-audit', getStoredAudit);
toolRouter.post('/development-audit', postDevelopmentAudit);
toolRouter.get('/:id', getOneTool);
toolRouter.post('/', postTool);
toolRouter.patch('/:id', patchTool);
toolRouter.delete('/:id', removeTool);
