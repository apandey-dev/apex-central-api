import { Router } from 'express';
import {
  createLog,
  getLogs,
  createLogSchema,
} from '../controllers/log.controller';
import { optionalAuth, authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

/**
 * @openapi
 * /api/logs:
 *   post:
 *     tags:
 *       - Activity Logs
 *     summary: Record a new activity or audit log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 example: USER_SIGNUP
 *               details:
 *                 type: string
 *                 example: User signed up via web portal
 *     responses:
 *       201:
 *         description: Log recorded
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Get activity logs (Requires Auth)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
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
 *         description: List of activity logs
 *       401:
 *         description: Unauthorized
 */
router.post('/', optionalAuth, validate(createLogSchema), createLog);
router.get('/', authenticate, getLogs);

export default router;
