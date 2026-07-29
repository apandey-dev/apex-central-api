import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './config/prisma';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Prisma connected to database (SQLite)');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 Swagger API Docs available at http://localhost:${PORT}/api-docs`);
      console.log(`⚡ Health Check available at http://localhost:${PORT}/api/health`);
    });

    const shutdown = async () => {
      console.log('\n⏳ Shutting down server gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('🛑 Server closed and Prisma disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
