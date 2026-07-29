import { Router } from 'express';
import { getImage, uploadShortImage } from '../controllers/image.controller';
import { optionalAuth } from '../middleware/auth.middleware';
import { uploadAvatar } from '../middleware/upload.middleware';

const router = Router();

/**
 * @openapi
 * /api/images/{category}/{name}:
 *   get:
 *     tags:
 *       - Media & Assets
 *     summary: Serve image/SVG asset with clean short URL
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         example: logos
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         example: logo_1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image asset file stream
 *       404:
 *         description: Image asset not found
 */
router.get('/:category/:name', getImage);
router.get('/:category', getImage);

/**
 * @openapi
 * /api/images/upload:
 *   post:
 *     tags:
 *       - Media & Assets
 *     summary: Upload image/SVG asset and generate short clean URL
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
 *                 description: Image or SVG file
 *               category:
 *                 type: string
 *                 example: logos
 *                 description: Category subfolder (logos, avatars, products, etc.)
 *     responses:
 *       201:
 *         description: Image asset uploaded with short URL (e.g. api.apandey.me/api/images/logos/logo_1)
 */
router.post('/upload', optionalAuth, uploadAvatar.single('pfp'), uploadShortImage);

export default router;
