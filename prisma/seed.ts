import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Apex Central API database with 20 Users, 20 Products, and 20 Anime PFPs...');

  // Clean up existing records
  await prisma.activityLog.deleteMany();
  await prisma.userData.deleteMany();
  await prisma.message.deleteMany();
  await prisma.todo.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 20 Anime PFP / Avatar URLs
  const avatarUrls = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517423470506-3f609e97e88d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=400&q=80',
  ];

  // 20 Users Definition
  const usersData = [
    { username: 'admin_user', email: 'admin@apex.local', name: 'Arpit (Admin)', role: 'ADMIN', bio: 'Apex Central System Administrator' },
    { username: 'luffy_d', email: 'luffy@anime.local', name: 'Monkey D. Luffy', role: 'USER', bio: 'Captain of Straw Hat Pirates' },
    { username: 'gojo_s', email: 'gojo@anime.local', name: 'Satoru Gojo', role: 'USER', bio: 'Strongest Jujutsu Sorcerer' },
    { username: 'naruto_u', email: 'naruto@anime.local', name: 'Naruto Uzumaki', role: 'USER', bio: 'Seventh Hokage of Hidden Leaf' },
    { username: 'zoro_r', email: 'zoro@anime.local', name: 'Roronoa Zoro', role: 'USER', bio: 'Master Swordsman' },
    { username: 'levi_a', email: 'levi@anime.local', name: 'Levi Ackerman', role: 'USER', bio: 'Special Operations Captain' },
    { username: 'tanjiro_k', email: 'tanjiro@anime.local', name: 'Tanjiro Kamado', role: 'USER', bio: 'Demon Slayer Corps' },
    { username: 'nezuko_k', email: 'nezuko@anime.local', name: 'Nezuko Kamado', role: 'USER', bio: 'Demon Slayer Guardian' },
    { username: 'kakashi_h', email: 'kakashi@anime.local', name: 'Kakashi Hatake', role: 'USER', bio: 'Copy Ninja Kakashi' },
    { username: 'killua_z', email: 'killua@anime.local', name: 'Killua Zoldyck', role: 'USER', bio: 'Pro Hunter & Assassin' },
    { username: 'gon_f', email: 'gon@anime.local', name: 'Gon Freecss', role: 'USER', bio: 'Pro Hunter Rookie' },
    { username: 'saitama_o', email: 'saitama@anime.local', name: 'Saitama', role: 'USER', bio: 'One Punch Hero' },
    { username: 'goku_s', email: 'goku@anime.local', name: 'Son Goku', role: 'USER', bio: 'Earth Hero Saiyan' },
    { username: 'vegeta_s', email: 'vegeta@anime.local', name: 'Vegeta', role: 'USER', bio: 'Prince of All Saiyans' },
    { username: 'itachi_u', email: 'itachi@anime.local', name: 'Itachi Uchiha', role: 'USER', bio: 'Master of Sharingan' },
    { username: 'edward_e', email: 'edward@anime.local', name: 'Edward Elric', role: 'USER', bio: 'Fullmetal Alchemist' },
    { username: 'nami_c', email: 'nami@anime.local', name: 'Nami', role: 'USER', bio: 'Master Navigator' },
    { username: 'light_y', email: 'light@anime.local', name: 'Light Yagami', role: 'USER', bio: 'Master Strategist' },
    { username: 'mikasa_a', email: 'mikasa@anime.local', name: 'Mikasa Ackerman', role: 'USER', bio: 'Elite Scout Corps' },
    { username: 'eren_y', email: 'eren@anime.local', name: 'Eren Yeager', role: 'USER', bio: 'Scout Corps Titan' },
  ];

  const createdUsers = [];
  for (let i = 0; i < usersData.length; i++) {
    const u = usersData[i];
    const user = await prisma.user.create({
      data: {
        username: u.username,
        email: u.email,
        name: u.name,
        password: hashedPassword,
        avatarUrl: avatarUrls[i],
        bio: u.bio,
        role: u.role,
      },
    });
    createdUsers.push(user);
  }

  console.log(`👤 Created ${createdUsers.length} Users with PFP Avatars`);

  // 20 Products across 20 Distinct Categories
  const productsData = [
    { name: 'Apex Pro Mechanical Keyboard', category: 'Electronics', price: 129.99, stock: 45, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80' },
    { name: 'Next-Gen Wireless Pro Controller', category: 'Gaming', price: 69.99, stock: 80, image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=500&q=80' },
    { name: 'Studio Noise-Canceling Headphones', category: 'Audio', price: 199.99, stock: 25, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80' },
    { name: 'Minimalist Ergonomic Desk Mat', category: 'Accessories', price: 24.99, stock: 150, image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=500&q=80' },
    { name: 'Ultra Smartwatch Fitness Tracker', category: 'Smart Devices', price: 149.99, stock: 60, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' },
    { name: 'Heavy-Duty Adjustable Dumbbells', category: 'Fitness', price: 89.99, stock: 30, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=500&q=80' },
    { name: 'Cyberpunk Developer Hoodie', category: 'Apparel', price: 59.99, stock: 100, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80' },
    { name: 'Modern API Architecture Handbook', category: 'Books', price: 34.99, stock: 200, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Air Cushion Running Sneakers', category: 'Footwear', price: 119.99, stock: 40, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
    { name: 'RGB Ambient LED Desk Light Bar', category: 'Home & Living', price: 49.99, stock: 90, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Canvas Digital Cyberpunk Art Print', category: 'Artwork', price: 79.99, stock: 15, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=500&q=80' },
    { name: 'Ergonomic Executive Office Chair', category: 'Office', price: 299.99, stock: 20, image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=500&q=80' },
    { name: 'Smart Fingerprint Door Lock', category: 'Security', price: 139.99, stock: 35, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=80' },
    { name: 'Collector Edition Mecha Figure', category: 'Toys', price: 159.99, stock: 10, image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80' },
    { name: 'Portable MIDI Synth Keyboard', category: 'Musical Instruments', price: 179.99, stock: 22, image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80' },
    { name: '4K Ultra HD Compact Camera', category: 'Photography', price: 449.99, stock: 12, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80' },
    { name: 'Automatic Espresso Coffee Machine', category: 'Kitchenware', price: 249.99, stock: 18, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=500&q=80' },
    { name: 'Wireless Car Diagnostic Scanner', category: 'Automotive', price: 45.99, stock: 70, image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Waterproof Hardshell Travel Backpack', category: 'Travel', price: 89.99, stock: 55, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80' },
    { name: 'Titanium Precision Fountain Pen', category: 'Stationery', price: 39.99, stock: 110, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=500&q=80' },
  ];

  for (const p of productsData) {
    const slug = p.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: `Premium quality ${p.name} in the ${p.category} category.`,
        price: p.price,
        stock: p.stock,
        category: p.category,
        imageUrl: p.image,
        userId: createdUsers[0].id,
      },
    });
  }

  console.log(`🛍️ Created ${productsData.length} Products across 20 distinct categories`);

  // Sample User Todos
  await prisma.todo.createMany({
    data: [
      { title: 'API Security Audit', description: 'Ensure public registration is locked', status: 'COMPLETED', priority: 'HIGH', userId: createdUsers[0].id },
      { title: 'Seed 20 Categories', description: 'Add products and users with anime PFPs', status: 'COMPLETED', priority: 'HIGH', userId: createdUsers[0].id },
      { title: 'Test Swagger UI Explorer', description: 'Verify dark theme and Fredoka font', status: 'IN_PROGRESS', priority: 'MEDIUM', userId: createdUsers[0].id },
    ],
  });

  // Sample Key-Value Settings
  await prisma.userData.createMany({
    data: [
      { userId: createdUsers[0].id, key: 'security_config', value: JSON.stringify({ publicRegistration: false, lockWrites: true }) },
      { userId: createdUsers[0].id, key: 'api_theme', value: JSON.stringify({ font: 'Fredoka', theme: 'dark-glassmorphism' }) },
    ],
  });

  // Sample Activity Log
  await prisma.activityLog.create({
    data: {
      action: 'SYSTEM_LOCKDOWN',
      details: 'Public registration locked to ADMIN only. 20 Users and 20 Products seeded.',
      ipAddress: '127.0.0.1',
      userId: createdUsers[0].id,
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
