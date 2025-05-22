import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { createTaskSchema, updateTaskSchema, taskFilterSchema } from '../validators/task.validator';
import { UserRole } from '../types';

const router = Router();

// All routes are protected
router.use(authenticate);

// Task routes
router.post('/', validate(createTaskSchema), createTask);
router.get('/', validateQuery(taskFilterSchema), getTasks);
router.get('/:id', getTaskById);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

// Admin-only routes
router.get('/admin/all', authorize([UserRole.ADMIN]), validateQuery(taskFilterSchema), getTasks);

export default router;
