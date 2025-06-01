import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByDate,
  createTaskForDate,
} from '../controllers/task.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { createTaskSchema, updateTaskSchema, taskFilterSchema } from '../validators/task.validator';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/dashboard/:date', getTasksByDate);

router.post('/create/:date', validate(createTaskSchema), createTaskForDate);

router.get('/', validateQuery(taskFilterSchema), getTasks);

router.get('/', validateQuery(taskFilterSchema), getTasks);

router.get('/:id', getTaskById);

router.put('/:id', validate(updateTaskSchema), updateTask);

router.delete('/:id', deleteTask);

router.get('/admin/all', authorize([UserRole.ADMIN]), validateQuery(taskFilterSchema), getTasks);

router.get('/admin/all', authorize([UserRole.ADMIN]), validateQuery(taskFilterSchema), getTasks);

export default router;
