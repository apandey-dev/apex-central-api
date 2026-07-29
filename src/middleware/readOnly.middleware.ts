import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const readOnlyGuard = (req: Request, res: Response, next: NextFunction) => {
  // Allow all GET requests (Public read access)
  if (req.method === 'GET') {
    return next();
  }

  // Allow login endpoint for authenticating and obtaining tokens
  if (req.method === 'POST' && req.path === '/api/auth/login') {
    return next();
  }

  // Block image and PFP uploads strictly
  if (
    req.path.includes('/avatar') ||
    req.path.includes('/images/upload') ||
    (req.headers['content-type'] &&
      req.headers['content-type'].includes('multipart/form-data'))
  ) {
    return sendError(
      res,
      'Action restricted: Image and PFP file uploads are currently disabled.',
      403
    );
  }

  // Block all new entity creation endpoints (POST)
  if (req.method === 'POST') {
    return sendError(
      res,
      'Action restricted: Adding new data is currently disabled in read-only mode.',
      403
    );
  }

  // PUT, PATCH, DELETE are allowed for JSON data updates and deletions
  next();
};
