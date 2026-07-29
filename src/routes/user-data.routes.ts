import { Router } from 'express';
import {
  setUserData,
  getUserDataByKey,
  getAllUserData,
  deleteUserDataKey,
  setUserDataSchema,
} from '../controllers/user-data.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /api/user-data:
 *   post:
 *     tags:
 *       - Key-Value Storage
 *     summary: Set or update a key-value setting for current user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *                 example: theme_preferences
 *               value:
 *                 example: { "dark": true, "accent": "#6366f1" }
 *     responses:
 *       200:
 *         description: Key-value data saved successfully
 *   get:
 *     tags:
 *       - Key-Value Storage
 *     summary: Get all key-value settings for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All user settings
 */
router.post('/', validate(setUserDataSchema), setUserData);
router.get('/', getAllUserData);

/**
 * @openapi
 * /api/user-data/{key}:
 *   get:
 *     tags:
 *       - Key-Value Storage
 *     summary: Get value for a specific key
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Value retrieved
 *       404:
 *         description: Key not found
 *   delete:
 *     tags:
 *       - Key-Value Storage
 *     summary: Delete a specific setting key
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Key deleted
 *       404:
 *         description: Key not found
 */
router.get('/:key', getUserDataByKey);
router.delete('/:key', deleteUserDataKey);

export default router;
