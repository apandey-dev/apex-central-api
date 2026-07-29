import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createMessageSchema = z.object({
  senderName: z.string().min(1, 'Sender name is required'),
  senderEmail: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
});

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { senderName, senderEmail, subject, content } = req.body;

    const message = await prisma.message.create({
      data: {
        senderName,
        senderEmail,
        subject,
        content,
        userId: userId || null,
      },
    });

    return sendSuccess(
      res,
      'Message submitted successfully',
      { message },
      201
    );
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit message', 500);
  }
};

export const getMessages = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const isRead = req.query.isRead
      ? req.query.isRead === 'true'
      : undefined;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (isRead !== undefined) where.isRead = isRead;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.message.count({ where }),
    ]);

    return sendSuccess(res, 'Messages retrieved', { messages }, 200, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch messages', 500);
  }
};

export const markMessageRead = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const message = await prisma.message.findUnique({ where: { id } });

    if (!message) {
      return sendError(res, 'Message not found', 404);
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    return sendSuccess(res, 'Message marked as read', { message: updated });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update message', 500);
  }
};

export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const existing = await prisma.message.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Message not found', 404);
    }

    await prisma.message.delete({ where: { id } });
    return sendSuccess(res, 'Message deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete message', 500);
  }
};
