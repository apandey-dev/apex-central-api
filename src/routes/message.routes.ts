import { Router } from 'express';
import {
  sendMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
  createMessageSchema,
} from '../controllers/message.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

/**
 * @openapi
 * /api/messages:
 *   post:
 *     tags:
 *       - Messages & Support
 *     summary: Submit a contact message or user feedback (Public)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderName
 *               - senderEmail
 *               - content
 *             properties:
 *               senderName:
 *                 type: string
 *                 example: Sarah Jenkins
 *               senderEmail:
 *                 type: string
 *                 example: sarah@example.com
 *               subject:
 *                 type: string
 *                 example: Project Collaboration
 *               content:
 *                 type: string
 *                 example: Interested in building an API integration.
 *     responses:
 *       201:
 *         description: Message submitted
 *   get:
 *     tags:
 *       - Messages & Support
 *     summary: Get all submitted messages (Requires Auth)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
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
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 */
router.post('/', optionalAuth, validate(createMessageSchema), sendMessage);
router.get('/', authenticate, getMessages);

/**
 * @openapi
 * /api/messages/{id}/read:
 *   patch:
 *     tags:
 *       - Messages & Support
 *     summary: Mark a message as read (Requires Auth)
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
 *         description: Message marked as read
 */
router.patch('/:id/read', authenticate, markMessageRead);

/**
 * @openapi
 * /api/messages/{id}:
 *   delete:
 *     tags:
 *       - Messages & Support
 *     summary: Delete a message (Requires Auth)
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
 *         description: Message deleted
 */
router.delete('/:id', authenticate, deleteMessage);

export default router;
