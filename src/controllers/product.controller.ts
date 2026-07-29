import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than zero'),
  stock: z.number().int().min(0).optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().or(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { name, description, price, stock, category, imageUrl, isPublished } =
      req.body;

    let baseSlug = slugify(name);
    let slug = baseSlug;
    let count = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock: stock ?? 0,
        category: category || 'General',
        imageUrl,
        isPublished: isPublished ?? true,
        userId,
      },
    });

    return sendSuccess(res, 'Product created successfully', { product }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create product', 500);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return sendSuccess(res, 'Products retrieved successfully', { products }, 200, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to list products', 500);
  }
};

export const getProductBySlugOrId = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: key }, { slug: key }],
      },
    });

    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    return sendSuccess(res, 'Product details retrieved', { product });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to get product', 500);
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Product not found', 404);
    }

    let slug = existing.slug;
    if (data.name && data.name !== existing.name) {
      let baseSlug = slugify(data.name);
      slug = baseSlug;
      let count = 1;
      while (
        await prisma.product.findFirst({
          where: { slug, NOT: { id } },
        })
      ) {
        slug = `${baseSlug}-${count++}`;
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });

    return sendSuccess(res, 'Product updated successfully', { product: updated });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update product', 500);
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Product not found', 404);
    }

    await prisma.product.delete({ where: { id } });
    return sendSuccess(res, 'Product deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete product', 500);
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    return sendSuccess(res, 'Categories retrieved', {
      categories: categories.map((c) => ({
        name: c.category,
        count: c._count.category,
      })),
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to get categories', 500);
  }
};
