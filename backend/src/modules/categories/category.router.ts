import { Router } from 'express';
import { authenticateAdmin } from '../../middleware/auth.middleware';
import {
  getCategoryList,
  getOneCategory,
  getParentOptions,
  patchCategory,
  postCategory,
  removeCategory,
} from './category.controller';

export const categoryRouter = Router();

categoryRouter.use(authenticateAdmin);
categoryRouter.get('/', getCategoryList);
categoryRouter.get('/options', getParentOptions);
categoryRouter.get('/:id', getOneCategory);
categoryRouter.post('/', postCategory);
categoryRouter.patch('/:id', patchCategory);
categoryRouter.delete('/:id', removeCategory);
