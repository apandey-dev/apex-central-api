import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { getBaseUrl } from '../utils/url';

export const notFoundHandler = (req: Request, res: Response) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const baseUrl = getBaseUrl(req);
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found | Apex Central API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(15, 23, 42, 0.85);
      --card-border: rgba(255, 255, 255, 0.08);
      --primary: #6366f1;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Fredoka', cursive, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background-image: 
        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15), transparent 45%),
        radial-gradient(circle at 80% 80%, rgba(239, 68, 68, 0.12), transparent 45%);
    }
    .box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .code {
      font-size: 4rem;
      font-weight: 700;
      background: linear-gradient(135deg, #f87171, #ef4444);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    p {
      color: var(--text-muted);
      font-size: 0.925rem;
      margin-bottom: 1.5rem;
      line-height: 1.4;
    }
    .path-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.775rem;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      color: #fca5a5;
      display: inline-block;
      margin-bottom: 1.5rem;
      word-break: break-all;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1.4rem;
      border-radius: 10px;
      font-family: 'Fredoka', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
      transition: all 0.2s ease;
    }
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
    }
  </style>
</head>
<body>
  <div class="box">
    <div class="code">404</div>
    <h1>Route Not Found</h1>
    <p>The endpoint or page you requested does not exist on Apex Central API.</p>
    <div class="path-pill">${req.method} ${req.originalUrl}</div>
    <div>
      <a href="${baseUrl}/" class="btn">🏠 Return to Developer Portal</a>
    </div>
  </div>
</body>
</html>`;
    return res.status(404).send(html);
  }

  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Unhandled Error:', err);
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const baseUrl = getBaseUrl(req);
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${statusCode} - ${statusCode === 403 ? 'Access Blocked' : 'Server Error'} | Apex Central API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(15, 23, 42, 0.85);
      --card-border: rgba(255, 255, 255, 0.08);
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Fredoka', cursive, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background-image: 
        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15), transparent 45%),
        radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.12), transparent 45%);
    }
    .box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .code {
      font-size: 4rem;
      font-weight: 700;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    p {
      color: var(--text-muted);
      font-size: 0.925rem;
      margin-bottom: 1.5rem;
      line-height: 1.4;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1.4rem;
      border-radius: 10px;
      font-family: 'Fredoka', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
      transition: all 0.2s ease;
    }
    .btn:hover {
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="box">
    <div class="code">${statusCode}</div>
    <h1>${statusCode === 403 ? 'Access Restricted' : 'Error Occurred'}</h1>
    <p>${message}</p>
    <div>
      <a href="${baseUrl}/" class="btn">🏠 Return to Portal</a>
    </div>
  </div>
</body>
</html>`;
    return res.status(statusCode).send(html);
  }

  return sendError(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );
};
