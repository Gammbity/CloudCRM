import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const salesPass = await bcrypt.hash('sales123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@crmcloud.uz' },
    update: { password: adminPass, name: 'Admin User', role: Role.admin },
    create: { email: 'admin@crmcloud.uz', password: adminPass, name: 'Admin User', role: Role.admin },
  });

  const sales = await prisma.user.upsert({
    where: { email: 'sales1@crmcloud.uz' },
    update: { password: salesPass, name: 'Sales User', role: Role.sales },
    create: { email: 'sales1@crmcloud.uz', password: salesPass, name: 'Sales User', role: Role.sales },
  });

  console.log('Demo users upserted:', { admin: admin.email, sales: sales.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
