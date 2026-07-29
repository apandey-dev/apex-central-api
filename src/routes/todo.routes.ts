import { Router } from 'express';
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
  getTodoStats,
  createTodoSchema,
  updateTodoSchema,
} from '../controllers/todo.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /api/todos:
 *   get:
 *     tags:
 *       - Task Manager
 *     summary: Get tasks for current authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of user tasks
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags:
 *       - Task Manager
 *     summary: Create a new task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Design API Endpoints
 *               description:
 *                 type: string
 *                 example: Define Swagger schemas and data models.
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 *                 default: PENDING
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 default: MEDIUM
 *               dueDate:
 *                 type: string
 *                 example: 2026-08-15T00:00:00.000Z
 *               tags:
 *                 type: string
 *                 example: api,design,backend
 *     responses:
 *       201:
 *         description: Task created
 *       401:
 *         description: Unauthorized
 */
router.post('/', validate(createTodoSchema), createTodo);
router.get('/', getTodos);

/**
 * @openapi
 * /api/todos/stats:
 *   get:
 *     tags:
 *       - Task Manager
 *     summary: Get task summary statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Completion rate and counts by status
 */
router.get('/stats', getTodoStats);

/**
 * @openapi
 * /api/todos/{id}:
 *   get:
 *     tags:
 *       - Task Manager
 *     summary: Get task details by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 *   put:
 *     tags:
 *       - Task Manager
 *     summary: Update an existing task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 *   delete:
 *     tags:
 *       - Task Manager
 *     summary: Delete a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.get('/:id', getTodoById);
router.put('/:id', validate(updateTodoSchema), updateTodo);
router.delete('/:id', deleteTodo);

/**
 * @openapi
 * /api/todos/{id}/toggle:
 *   patch:
 *     tags:
 *       - Task Manager
 *     summary: Toggle task completion status between COMPLETED and PENDING
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status toggled successfully
 */
router.patch('/:id/toggle', toggleTodoStatus);

export default router;
