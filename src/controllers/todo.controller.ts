import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime({ offset: true }).or(z.string()).optional(),
  tags: z.string().optional(),
});

export const updateTodoSchema = createTodoSchema.partial();

export const createTodo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { title, description, status, priority, dueDate, tags } = req.body;

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        tags,
        userId,
      },
    });

    return sendSuccess(res, 'Todo created successfully', { todo }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create todo', 500);
  }
};

export const getTodos = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.todo.count({ where }),
    ]);

    return sendSuccess(res, 'Todos retrieved successfully', { todos }, 200, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to get todos', 500);
  }
};

export const getTodoById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const todo = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) {
      return sendError(res, 'Todo not found', 404);
    }

    return sendSuccess(res, 'Todo retrieved successfully', { todo });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch todo', 500);
  }
};

export const updateTodo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return sendError(res, 'Todo not found', 404);
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: {
        ...data,
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
      },
    });

    return sendSuccess(res, 'Todo updated successfully', { todo: updated });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update todo', 500);
  }
};

export const toggleTodoStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const todo = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) {
      return sendError(res, 'Todo not found', 404);
    }

    const nextStatus = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    const updated = await prisma.todo.update({
      where: { id },
      data: { status: nextStatus },
    });

    return sendSuccess(res, `Todo status toggled to ${nextStatus}`, {
      todo: updated,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to toggle status', 500);
  }
};

export const deleteTodo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const existing = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return sendError(res, 'Todo not found', 404);
    }

    await prisma.todo.delete({ where: { id } });

    return sendSuccess(res, 'Todo deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete todo', 500);
  }
};

export const getTodoStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const [total, completed, pending, inProgress] = await Promise.all([
      prisma.todo.count({ where: { userId } }),
      prisma.todo.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.todo.count({ where: { userId, status: 'PENDING' } }),
      prisma.todo.count({ where: { userId, status: 'IN_PROGRESS' } }),
    ]);

    return sendSuccess(res, 'Todo stats retrieved', {
      stats: {
        total,
        completed,
        pending,
        inProgress,
        completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) + '%' : '0%',
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to get stats', 500);
  }
};
