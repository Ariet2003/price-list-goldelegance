import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = '12345';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const setting = await prisma.settings.upsert({
    where: {
      key: 'account'
    },
    update: {
      value: hashedPassword
    },
    create: {
      key: 'account',
      value: hashedPassword
    }
  });

  console.log('Added account setting:', setting);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 