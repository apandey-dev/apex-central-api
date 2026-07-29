import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { uploadToSupabase } from '../config/supabase';
import fs from 'fs';

export const updateUserSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url('Avatar URL must be a valid URL').optional(),
});

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { name, bio, avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        role: true,
        updatedAt: true,
      },
    });

    return sendSuccess(res, 'Profile updated successfully', { user });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update profile', 500);
  }
};

export const uploadAvatarHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!req.file) {
      return sendError(res, 'No image file uploaded', 400);
    }

    let avatarUrl = '';

    // Attempt Supabase Cloud Storage upload if credentials are model-configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        avatarUrl = await uploadToSupabase(
          fileBuffer,
          req.file.filename,
          req.file.mimetype,
          userId
        );
      } catch (err: any) {
        console.warn('Supabase upload fallback to local URL:', err.message);
      }
    }

    // Fallback to local / server static URL if Supabase is not yet linked
    if (!avatarUrl) {
      const host = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
      avatarUrl = `${host}/uploads/${req.file.filename}`;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
      },
    });

    return sendSuccess(
      res,
      'Profile picture (PFP) uploaded successfully',
      {
        avatarUrl,
        filename: req.file.filename,
        user,
      }
    );
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to upload avatar', 500);
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';

    const skip = (page - 1) * limit;

    const whereCondition = search
      ? {
          OR: [
            { username: { contains: search } },
            { email: { contains: search } },
            { name: { contains: search } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          avatarUrl: true,
          bio: true,
          role: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: whereCondition }),
    ]);

    return sendSuccess(res, 'Users retrieved successfully', { users }, 200, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to list users', 500);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, 'User profile retrieved', { user });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to get user profile', 500);
  }
};
