import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const codePassword = await bcrypt.hash('hayotim', 10);

  const entryUser = await prisma.user.upsert({
    where: { email: 'qonxor@local' },
    update: { password: codePassword, name: 'Qonxor Qizim', role: Role.sales },
    create: {
      email: 'qonxor@local',
      password: codePassword,
      name: 'Qonxor Qizim',
      role: Role.sales,
    },
  });

  console.log('Entry code user upserted:', { login: entryUser.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
