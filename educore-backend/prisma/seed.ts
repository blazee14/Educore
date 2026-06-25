// prisma/seed.ts
// Ejecutar con: npx ts-node prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const GRADOS_PRIMARIA = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
const GRADOS_SECUNDARIA = ['1ro', '2do', '3ro', '4to', '5to'];
const SECCIONES = ['A', 'B'];
const ANIO_ESCOLAR_ACTUAL = 2026;

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
      dosFaActivo: true,
    },
  });

  // Grados y secciones de Primaria
  for (const nombre of GRADOS_PRIMARIA) {
    const grado = await prisma.grado.upsert({
      where: { id: `primaria-${nombre}` },
      update: {},
      create: { id: `primaria-${nombre}`, nombre, nivel: 'PRIMARIA' },
    });
    for (const seccionNombre of SECCIONES) {
      await prisma.seccion.upsert({
        where: {
          gradoId_nombre_anioEscolar: {
            gradoId: grado.id,
            nombre: seccionNombre,
            anioEscolar: ANIO_ESCOLAR_ACTUAL,
          },
        },
        update: {},
        create: { gradoId: grado.id, nombre: seccionNombre, anioEscolar: ANIO_ESCOLAR_ACTUAL },
      });
    }
  }

  // Grados y secciones de Secundaria
  for (const nombre of GRADOS_SECUNDARIA) {
    const grado = await prisma.grado.upsert({
      where: { id: `secundaria-${nombre}` },
      update: {},
      create: { id: `secundaria-${nombre}`, nombre, nivel: 'SECUNDARIA' },
    });
    for (const seccionNombre of SECCIONES) {
      await prisma.seccion.upsert({
        where: {
          gradoId_nombre_anioEscolar: {
            gradoId: grado.id,
            nombre: seccionNombre,
            anioEscolar: ANIO_ESCOLAR_ACTUAL,
          },
        },
        update: {},
        create: { gradoId: grado.id, nombre: seccionNombre, anioEscolar: ANIO_ESCOLAR_ACTUAL },
      });
    }
  }

  console.log('Usuarios de prueba creados. Contraseña para ambos: Password123!');
  console.log('Grados y secciones del año', ANIO_ESCOLAR_ACTUAL, 'creados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });