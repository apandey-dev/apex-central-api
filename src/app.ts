import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import todoRoutes from './routes/todo.routes';
import productRoutes from './routes/product.routes';
import messageRoutes from './routes/message.routes';
import userDataRoutes from './routes/user-data.routes';
import logRoutes from './routes/log.routes';
import imageRoutes from './routes/image.routes';

import { notFoundHandler, errorHandler } from './middleware/error.middleware';
import { swaggerSpec } from './config/swagger';
import { sendSuccess } from './utils/response';
import { getBaseUrl } from './utils/url';

const app: Application = express();

// Security and utility middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files (PFP / Avatars)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Swagger Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root Endpoint (Welcome Page & Interactive API Portal with Fredoka Font & Dynamic Base URL)
app.get('/', (req, res) => {
  const baseUrl = getBaseUrl(req);

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return sendSuccess(res, 'Welcome to Apex Central API', {
      name: 'Apex Central API',
      status: 'online',
      docs: `${baseUrl}/api-docs`,
      health: `${baseUrl}/api/health`,
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        images: '/api/images',
        todos: '/api/todos',
        products: '/api/products',
        messages: '/api/messages',
        userData: '/api/user-data',
        logs: '/api/logs',
      },
    });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Central API | Developer Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(15, 23, 42, 0.85);
      --card-border: rgba(255, 255, 255, 0.08);
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --accent: #10b981;
      --cyan: #06b6d4;
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
      padding: 1.5rem;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.14), transparent 40%),
        radial-gradient(circle at 85% 85%, rgba(6, 182, 212, 0.14), transparent 40%);
      letter-spacing: 0.01em;
    }
    .container { max-width: 1240px; width: 100%; }
    header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.85rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
    h1 {
      font-size: 2.35rem;
      font-weight: 700;
      line-height: 1.15;
      background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.4rem;
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
      font-weight: 400;
      max-width: 640px;
      margin: 0 auto 1rem;
      line-height: 1.4;
    }
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 1.25rem;
      border-radius: 10px;
      font-family: 'Fredoka', sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
      box-shadow: 0 3px 14px rgba(99, 102, 241, 0.35);
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 20px rgba(99, 102, 241, 0.5);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text);
      border: 1px solid var(--card-border);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
    }
    
    /* 4-Column Responsive Grid Layout */
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.15rem;
      margin-top: 1.25rem;
    }
    @media (max-width: 1100px) {
      .grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .grid { grid-template-columns: 1fr; }
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.1rem 1.2rem;
      backdrop-filter: blur(12px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }
    .card:hover {
      border-color: rgba(99, 102, 241, 0.45);
      transform: translateY(-2px);
    }
    .card-top {
      margin-bottom: 0.85rem;
    }
    .card-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.45rem;
    }
    .card-header {
      font-size: 1.05rem;
      font-weight: 600;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn-view {
      font-family: 'Fredoka', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.35);
      color: #a5b4fc;
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .btn-view:hover {
      background: rgba(99, 102, 241, 0.35);
      color: #ffffff;
      transform: translateY(-1px);
    }
    .card-desc {
      color: var(--text-muted);
      font-size: 0.825rem;
      font-weight: 400;
      line-height: 1.38;
    }
    .endpoints-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .endpoint-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.725rem;
      font-weight: 500;
      background: rgba(2, 6, 23, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.28rem 0.5rem;
      border-radius: 6px;
      color: #818cf8;
      word-break: break-all;
    }
    footer {
      margin-top: 1.75rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.825rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="status-badge"><span class="badge-dot"></span> System Operational</div>
      <h1>Apex Central API</h1>
      <p class="subtitle">High-performance modular backend service for Authentication, Profile & PFP Management, Short Image & SVG URLs, Tasks, Product Catalog, User Messages, Key-Value Settings, and Activity Logging.</p>
      
      <div class="action-buttons">
        <a href="/api-docs" class="btn btn-primary">📖 Swagger API Docs</a>
        <a href="/api/health" class="btn btn-secondary">⚡ Health Check</a>
      </div>
    </header>

    <div class="grid">
      <!-- 1. Auth & Identity -->
      <div class="card">
        <div class="card-top">
          <div class="card-header-row">
            <div class="card-header">🔐 Auth & Identity</div>
            <a href="/api-docs#/Auth%20%26%20Identity" class="btn-view" target="_blank">Try API ↗</a>
          </div>
          <p class="card-desc">User registration, login tokens, account profile, and password security.</p>
        </div>
        <div class="endpoints-list">
          <span class="endpoint-tag">POST /api/auth/register</span>
          <span class="endpoint-tag">POST /api/auth/login</span>
          <span class="endpoint-tag">GET /api/auth/me</span>
        </div>
      </div>

      <!-- 2. User Profiles & PFP -->
      <div class="card">
        <div class="card-top">
          <div class="card-header-row">
            <div class="card-header">👤 Profiles & PFP</div>
            <a href="/api/users" class="btn-view" target="_blank">View Data ↗</a>
          </div>
          <p class="card-desc">Profile Picture (PFP) uploads, avatar management, and user profiles.</p>
        </div>
        <div class="endpoints-list">
          <span class="endpoint-tag">POST /api/users/avatar</span>
          <span class="endpoint-tag">GET /api/users</span>
          <span class="endpoint-tag">PUT /api/users/profile</span>
        </div>
      </div>

      <!-- 3. Short Image & SVG Assets -->
      <div class="card">
        <div class="card-top">
          <div class="card-header-row">
            <div class="card-header">🖼️ Short Media URLs</div>
            <a href="/api-docs#/Media%20%26%20Assets" class="btn-view" target="_blank">Try API ↗</a>
          </div>
          <p class="card-desc">Clean, short URLs for logos, SVGs, and images (e.g. /api/images/logos/logo_1).</p>
        </div>
        <div class="endpoints-list">
          <span class="endpoint-tag">GET /api/images/logos/logo_1</span>
          <span class="endpoint-tag">GET /api/images/avatars/user_1</span>
          <span class="endpoint-tag">POST /api/images/upload</span>
        </div>
      </div>

      <!-- 4. Task Manager -->
      <div class="card">
        <div class="card-top">
          <div class="card-header-row">
            <div class="card-header">📝 Task Manager</div>
            <a href="/api-docs#/Task%20Manager" class="btn-view" target="_blank">Try API ↗</a>
          </div>
          <p class="card-desc">Task CRUD, status toggling, priorities, due dates, and completion metrics.</p>
        </div>
        <div class="endpoints-list">
          <span class="endpoint-tag">GET /api/todos</span>
          <span class="endpoint-tag">POST /api/todos</span>
          <span class="endpoint-tag">GET /api/todos/stats</span>
        </div>
      </div>

      <!-- 5. Product Catalog -->
      <div class="card">
        <div class="card-top">
          <div class="card-header-row">
            <div class="card-header">🛍️ Product Catalog</div>
            <a href="/api/products" class="btn-view" target="_blank">View Data ↗</a>
          </div>
          <p class="card-desc">Products with categories, price range filters, search, and automatic slugging.</p>
        </div>
        <div class="endpoints-list">
          <span class="endpoint-tag">GET /api/products</span>
          <span class="endpoint-tag">GET /api/products/categories</span>
          <span class="endpoint-tag">POST /api/products</span>
        </div>
      </div>

      <!-- 6. Messages & Support -->
      <div class="card">
        <div class="card-top">
          <div class="card-header-row">
            <div class="card-header">💬 Messages</div>
            <a href="/api-docs#/Messages%20%26%20Support" class="btn-view" target="_blank">Try API ↗</a>
          </div>
          <p class="card-desc">Contact form submissions, user messages, read receipts, and message management.</p>
        </div>
        <div class="endpoints-list">
          <span class="endpoint-tag">POST /api/messages</span>
          <span class="endpoint-tag">GET /api/messages</span>
          <span class="endpoint-tag">PATCH /api/messages/:id/read</span>
        </div>
      </div>

      <!-- 7. Key-Value Storage -->
      <div class="card">
        <div class="card-top">
          <div class="card-header-row">
            <div class="card-header">⚙️ Key-Value Store</div>
            <a href="/api-docs#/Key-Value%20Storage" class="btn-view" target="_blank">Try API ↗</a>
          </div>
          <p class="card-desc">Persistent key-value user storage for app settings, metadata, and JSON state.</p>
        </div>
        <div class="endpoints-list">
          <span class="endpoint-tag">POST /api/user-data</span>
          <span class="endpoint-tag">GET /api/user-data</span>
          <span class="endpoint-tag">GET /api/user-data/:key</span>
        </div>
      </div>

      <!-- 8. Activity Logs -->
      <div class="card">
        <div class="card-top">
          <div class="card-header-row">
            <div class="card-header">📜 Activity Logs</div>
            <a href="/api-docs#/Activity%20Logs" class="btn-view" target="_blank">Try API ↗</a>
          </div>
          <p class="card-desc">Audit trail logging, event tracking, and system action logs.</p>
        </div>
        <div class="endpoints-list">
          <span class="endpoint-tag">POST /api/logs</span>
          <span class="endpoint-tag">GET /api/logs</span>
        </div>
      </div>
    </div>

    <footer>
      Node.js • Express • TypeScript • Prisma • SQLite • Open <a href="/api-docs" style="color:#818cf8; text-decoration:none; font-weight:600;">Swagger Docs</a>
    </footer>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  return sendSuccess(res, 'Apex Central API is operational', {
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: [
      'Auth & Identity',
      'User Profiles & PFP Uploads',
      'Short Image & SVG Asset Proxy',
      'Task Manager',
      'Product Catalog',
      'User Messages & Support',
      'Key-Value Storage',
      'Activity Logging',
    ],
  });
});

// Main API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/products', productRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/user-data', userDataRoutes);
app.use('/api/logs', logRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
