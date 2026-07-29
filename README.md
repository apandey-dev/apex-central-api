# Apex Central API

A high-performance, modular backend API service built with **Node.js, Express, TypeScript, Prisma ORM, and SQLite**.

Designed to handle all essential backend core services: Authentication, Profile & Avatar (PFP) Management, Task/Todo Management, Product Catalog, User Contact Messages, Key-Value Settings Storage, and Audit Activity Logging.

---

## 🚀 Key Modules

- 🔐 **Auth & Identity**: Registration, Login, JWT verification, password updates.
- 👤 **Users & Profile Pictures (PFP)**: Avatar upload via Multer, user profiles, bio management.
- 📝 **Task Manager**: Full CRUD, status toggling, priority levels, due dates, tags, and summary statistics.
- 🛍️ **Product Catalog**: Product listing with category filtering, search, pagination, price range filters, and auto-generated URL slugs.
- 💬 **Messages & Support**: Endpoint for receiving and managing contact forms / user messages.
- ⚙️ **Key-Value Settings Storage**: Flexible per-user settings/metadata storage (supports strings, numbers, booleans, and nested JSON objects).
- 📜 **Activity Logs**: System event tracking and audit logging.
- 📖 **Interactive Swagger UI**: Full OpenAPI interactive documentation UI at `/api-docs`.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The `.env` file is preconfigured. Customize the `JWT_SECRET` or `PORT` as needed:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-key-change-in-production-12345!"
JWT_EXPIRES_IN="7d"
SERVER_URL="http://localhost:5000"
```

### 3. Database Migration & Seeding
```bash
# Push database schema to SQLite
npm run db:push

# Seed initial database records
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

The server will start on **`http://localhost:5000`**.

---

## 📖 API Documentation & Swagger UI

Access the interactive API explorer at:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

Health Check Endpoint:
👉 **[http://localhost:5000/api/health](http://localhost:5000/api/health)**

---

## 🔐 Default Admin Account

| Role | Username | Email | Password |
|---|---|---|---|
| Admin | `admin_user` | `admin@apex.local` | `password123` |

---

## 📁 API Endpoints Overview

### 🗝️ Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive JWT token
- `GET /api/auth/me` - Get logged-in user profile (Requires Auth)
- `PUT /api/auth/change-password` - Update account password (Requires Auth)

### 👤 Users & Profile Pictures (`/api/users`)
- `GET /api/users` - List all registered users (Paginated)
- `GET /api/users/:id` - Get public profile of a user
- `PUT /api/users/profile` - Update profile info (Name, Bio, Avatar URL)
- `POST /api/users/avatar` - Upload a Profile Picture (PFP) image file (Requires Auth)

### 📝 Task Management (`/api/todos`)
- `GET /api/todos` - Get user's tasks (Filter by `status`, `priority`, `search`)
- `POST /api/todos` - Create a new task
- `GET /api/todos/stats` - Get completion metrics
- `GET /api/todos/:id` - Get task details
- `PUT /api/todos/:id` - Update task
- `PATCH /api/todos/:id/toggle` - Toggle task completion status
- `DELETE /api/todos/:id` - Delete task

### 🛍️ Product Catalog (`/api/products`)
- `GET /api/products` - List products (Filter by `category`, `search`, `minPrice`, `maxPrice`)
- `GET /api/products/categories` - List categories with product counts
- `GET /api/products/:key` - Get product by ID or slug
- `POST /api/products` - Create product (Requires Auth)
- `PUT /api/products/:id` - Update product (Requires Auth)
- `DELETE /api/products/:id` - Delete product (Requires Auth)

### 💬 Messages & Support (`/api/messages`)
- `POST /api/messages` - Submit contact message / feedback
- `GET /api/messages` - List all messages (Requires Auth)
- `PATCH /api/messages/:id/read` - Mark message as read
- `DELETE /api/messages/:id` - Delete message

### ⚙️ User Data / Key-Value Store (`/api/user-data`)
- `POST /api/user-data` - Set user key-value setting (Accepts primitive or JSON value)
- `GET /api/user-data` - Get all saved key-value settings for current user
- `GET /api/user-data/:key` - Get specific setting value by key
- `DELETE /api/user-data/:key` - Delete setting key

### 📜 Activity Logs (`/api/logs`)
- `POST /api/logs` - Record an activity log
- `GET /api/logs` - List activity logs with filters (Requires Auth)

---

## 🛠️ Project Structure

```
backend_api/
├── prisma/
│   ├── schema.prisma      # Database schema (User, Todo, Product, Message, UserData, ActivityLog)
│   └── seed.ts            # Database seed script
├── src/
│   ├── config/            # Prisma & Swagger configuration
│   ├── controllers/       # Route logic controllers
│   ├── middleware/        # Auth, Zod validation, Multer file upload, Error handlers
│   ├── routes/            # Express router modules
│   ├── utils/             # JWT, Password hash, Response formatters
│   ├── app.ts             # Express application setup
│   └── index.ts           # Server entry point
├── uploads/               # Stored uploaded Profile Pictures (PFPs)
├── .env                   # Environment config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies & NPM scripts
```
