import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const setUserDataSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.any(), // Accepts string, object, array, boolean, number
});

export const setUserData = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { key, value } = req.body;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    const data = await prisma.userData.upsert({
      where: {
        userId_key: {
          userId,
          key,
        },
      },
      update: {
        value: stringValue,
      },
      create: {
        userId,
        key,
        value: stringValue,
      },
    });

    let parsedValue = stringValue;
    try {
      parsedValue = JSON.parse(stringValue);
    } catch {
      // Return as plain string if not valid JSON
    }

    return sendSuccess(res, `User data '${key}' saved successfully`, {
      key: data.key,
      value: parsedValue,
      updatedAt: data.updatedAt,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to save user data', 500);
  }
};

export const getUserDataByKey = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { key } = req.params;

    const record = await prisma.userData.findUnique({
      where: {
        userId_key: {
          userId,
          key,
        },
      },
    });

    if (!record) {
      return sendError(res, `Key '${key}' not found`, 404);
    }

    let parsedValue = record.value;
    try {
      parsedValue = JSON.parse(record.value);
    } catch {
      // Keep as raw string
    }

    return sendSuccess(res, `User data for key '${key}' retrieved`, {
      key: record.key,
      value: parsedValue,
      updatedAt: record.updatedAt,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch user data', 500);
  }
};

export const getAllUserData = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const records = await prisma.userData.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    const formattedData: Record<string, any> = {};
    records.forEach((rec) => {
      try {
        formattedData[rec.key] = JSON.parse(rec.value);
      } catch {
        formattedData[rec.key] = rec.value;
      }
    });

    return sendSuccess(res, 'All user data retrieved', {
      data: formattedData,
      count: records.length,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch all user data', 500);
  }
};

export const deleteUserDataKey = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { key } = req.params;

    const existing = await prisma.userData.findUnique({
      where: {
        userId_key: {
          userId,
          key,
        },
      },
    });

    if (!existing) {
      return sendError(res, `Key '${key}' not found`, 404);
    }

    await prisma.userData.delete({
      where: {
        userId_key: {
          userId,
          key,
        },
      },
    });

    return sendSuccess(res, `Key '${key}' deleted successfully`);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete key', 500);
  }
};
