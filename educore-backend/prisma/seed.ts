// prisma/seed.ts
// Ejecutar con: npx ts-node prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  await prisma.usuario.upsert({
    where: { email: 'admin@educore.test' },
    update: {},
    create: {
      email: 'admin@educore.test',
      passwordHash,
      rol: 'ADMIN',
      dosFaActivo: false,
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'docente@educore.test' },
    update: {},
    create: {
      email: 'docente@educore.test',
      passwordHash,
      rol: 'DOCENTE',
      dosFaActivo: true, // para probar el flujo de 2FA
    },
  });

  console.log('Usuarios de prueba creados. Contraseña para ambos: Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
