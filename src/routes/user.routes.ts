import { Router } from 'express';
import {
  listUsers,
  getUserById,
  updateProfile,
  uploadAvatarHandler,
  updateUserSchema,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { uploadAvatar } from '../middleware/upload.middleware';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - User Profiles & PFP
 *     summary: List all registered users (Paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', listUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - User Profiles & PFP
 *     summary: Get user profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/:id', getUserById);

/**
 * @openapi
 * /api/users/profile:
 *   put:
 *     tags:
 *       - User Profiles & PFP
 *     summary: Update profile info (Name, Bio, Avatar URL)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Arpit
 *               bio:
 *                 type: string
 *                 example: Building modern APIs and backend architectures.
 *               avatarUrl:
 *                 type: string
 *                 example: https://images.unsplash.com/photo-1535713875002-d1d0cf377fde
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authenticate, validate(updateUserSchema), updateProfile);

/**
 * @openapi
 * /api/users/avatar:
 *   post:
 *     tags:
 *       - User Profiles & PFP
 *     summary: Upload Profile Picture (PFP) image file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pfp:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, WEBP, GIF)
 *     responses:
 *       200:
 *         description: PFP image uploaded successfully and avatarUrl updated
 *       400:
 *         description: No image file provided or invalid file type
 *       401:
 *         description: Unauthorized
 */
router.post('/avatar', authenticate, uploadAvatar.single('pfp'), uploadAvatarHandler);

export default router;
