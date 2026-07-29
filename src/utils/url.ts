import { Request } from 'express';

/**
 * Dynamically resolves the base URL of the current request.
 * Automatically respects proxy headers (x-forwarded-proto, x-forwarded-host) for Vercel and custom domains.
 */
export const getBaseUrl = (req: Request): string => {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto || req.protocol || 'https';

  const forwardedHost = req.headers['x-forwarded-host'];
  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || req.get('host');

  if (!host) {
    return process.env.SERVER_URL || 'https://api.apandey.me';
  }

  return `${protocol}://${host}`;
};
