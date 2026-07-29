import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createLogSchema = z.object({
  action: z.string().min(1, 'Action name is required'),
  details: z.string().optional(),
});

export const createLog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || null;
    const { action, details } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    const log = await prisma.activityLog.create({
      data: {
        action,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
        ipAddress,
        userId,
      },
    });

    return sendSuccess(res, 'Log recorded successfully', { log }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record log', 500);
  }
};

export const getLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const action = req.query.action as string;
    const userId = req.query.userId as string;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (action) where.action = { contains: action };
    if (userId) where.userId = userId;

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      }),
      prisma.activityLog.count({ where }),
    ]);

    return sendSuccess(res, 'Activity logs retrieved', { logs }, 200, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to get logs', 500);
  }
};
