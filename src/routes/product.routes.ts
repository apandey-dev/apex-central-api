import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductBySlugOrId,
  updateProduct,
  deleteProduct,
  getCategories,
  createProductSchema,
  updateProductSchema,
} from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Product Catalog
 *     summary: List all products (Public)
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
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
 *         description: List of products
 *   post:
 *     tags:
 *       - Product Catalog
 *     summary: Create a new product (Requires Auth)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wireless Mechanical Keyboard
 *               description:
 *                 type: string
 *                 example: RGB mechanical keyboard with blue switches.
 *               price:
 *                 type: number
 *                 example: 89.99
 *               stock:
 *                 type: integer
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: Electronics
 *               imageUrl:
 *                 type: string
 *                 example: https://images.unsplash.com/photo-1587829741301-dc798b83add3
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 */
router.get('/', getProducts);
router.post('/', authenticate, validate(createProductSchema), createProduct);

/**
 * @openapi
 * /api/products/categories:
 *   get:
 *     tags:
 *       - Product Catalog
 *     summary: Get all product categories with counts
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', getCategories);

/**
 * @openapi
 * /api/products/{key}:
 *   get:
 *     tags:
 *       - Product Catalog
 *     summary: Get product details by ID or Slug
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: Product ID or Slug string
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:key', getProductBySlugOrId);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     tags:
 *       - Product Catalog
 *     summary: Update product details (Requires Auth)
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
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 *   delete:
 *     tags:
 *       - Product Catalog
 *     summary: Delete a product (Requires Auth)
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
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.put('/:id', authenticate, validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
