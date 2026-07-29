import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing records
  await prisma.activityLog.deleteMany();
  await prisma.userData.deleteMany();
  await prisma.message.deleteMany();
  await prisma.todo.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create Primary Account
  const hashedPassword = await bcrypt.hash('password123', 10);
  const primaryUser = await prisma.user.create({
    data: {
      email: 'admin@apex.local',
      username: 'admin_user',
      name: 'Arpit',
      password: hashedPassword,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: 'Fullstack developer & administrator.',
      role: 'ADMIN',
    },
  });

  console.log(`👤 Created Admin Account: admin@apex.local (Username: admin_user)`);

  // Create Sample Tasks
  await prisma.todo.createMany({
    data: [
      {
        title: 'Initialize Apex Backend API',
        description: 'Express, TypeScript, Prisma ORM, and SQLite database',
        status: 'COMPLETED',
        priority: 'HIGH',
        tags: 'backend,typescript,express',
        userId: primaryUser.id,
      },
      {
        title: 'Profile Picture (PFP) Service',
        description: 'Multer image uploads to /api/users/avatar endpoint',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        tags: 'pfp,upload,media',
        userId: primaryUser.id,
      },
      {
        title: 'Product Catalog Integration',
        description: 'Filtering, categories, price range, and search endpoints',
        status: 'PENDING',
        priority: 'MEDIUM',
        tags: 'products,catalog',
        userId: primaryUser.id,
      },
      {
        title: 'Key-Value Settings Storage',
        description: 'Persistent app configuration & metadata store via /api/user-data',
        status: 'PENDING',
        priority: 'LOW',
        tags: 'settings,storage',
        userId: primaryUser.id,
      },
    ],
  });

  console.log('📝 Created 4 Tasks');

  // Create Sample Products
  await prisma.product.createMany({
    data: [
      {
        name: 'Developer Wireless Keyboard',
        slug: 'developer-wireless-keyboard',
        description: 'Mechanical keyboard with tactile switches and RGB backlighting.',
        price: 129.99,
        stock: 45,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80',
        userId: primaryUser.id,
      },
      {
        name: 'Ergonomic Desk Mat',
        slug: 'ergonomic-desk-mat',
        description: 'Waterproof felt desk pad for mouse precision and comfort.',
        price: 24.99,
        stock: 120,
        category: 'Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=500&q=80',
        userId: primaryUser.id,
      },
      {
        name: 'Noise-Canceling Headphones',
        slug: 'noise-canceling-headphones',
        description: 'Over-ear Bluetooth headphones with active noise cancellation.',
        price: 199.99,
        stock: 15,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
        userId: primaryUser.id,
      },
    ],
  });

  console.log('🛍️ Created 3 Products');

  // Create Sample Message
  await prisma.message.create({
    data: {
      senderName: 'Alice Smith',
      senderEmail: 'alice@example.com',
      subject: 'Inquiry regarding API integrations',
      content: 'Hello, I would like to integrate this backend service with my frontend web application.',
      userId: primaryUser.id,
    },
  });

  console.log('💬 Created User Message');

  // Create Key-Value Data
  await prisma.userData.createMany({
    data: [
      {
        userId: primaryUser.id,
        key: 'theme_settings',
        value: JSON.stringify({ mode: 'dark', primaryColor: '#6366f1', fontSize: 14 }),
      },
      {
        userId: primaryUser.id,
        key: 'notification_preferences',
        value: JSON.stringify({ email: true, push: false, weeklyDigest: true }),
      },
    ],
  });

  console.log('⚙️ Created 2 Key-Value Settings');

  // Create Activity Log
  await prisma.activityLog.create({
    data: {
      action: 'SYSTEM_INIT',
      details: 'System initialized successfully',
      ipAddress: '127.0.0.1',
      userId: primaryUser.id,
    },
  });

  console.log('📜 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
