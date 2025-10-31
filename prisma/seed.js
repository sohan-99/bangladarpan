import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@bangladarpan.com' },
    update: {},
    create: {
      email: 'admin@bangladarpan.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Admin user seeded successfully');
  console.log('Email: admin@bangladarpan.com');
  console.log('Password: admin123');
  console.log('WARNING: Change the default password after first login');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
