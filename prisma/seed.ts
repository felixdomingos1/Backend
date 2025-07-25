import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedSuperAdmin() {
  const hashedPassword = await bcrypt.hash('bianng@2025!', 10);
  
  await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password_hash: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  });

  console.log('Super Admin criado com sucesso!');
}

seedSuperAdmin()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });