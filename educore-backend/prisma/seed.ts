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
      dosFaActivo: false,
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

  const cursosBase = ['Matemática', 'Comunicación', 'Ciencia y Tecnología', 'Inglés', 'Educación Física'];
  for (const nombre of cursosBase) {
    await prisma.curso.upsert({
      where: { id: `curso-${nombre.toLowerCase().replace(/\s/g, '-')}` },
      update: {},
      create: { id: `curso-${nombre.toLowerCase().replace(/\s/g, '-')}`, nombre, nivel: 'SECUNDARIA' },
    });
  }
  
  // ── Docente ──
  const docenteUser = await prisma.usuario.findUniqueOrThrow({ where: { email: 'docente@educore.test' } });
  await prisma.docente.upsert({
    where: { usuarioId: docenteUser.id },
    update: {},
    create: {
      usuarioId: docenteUser.id,
      nombres: 'Juan',
      apellidos: 'Pérez',
      dni: '12345678',
      telefono: '999888777',
    },
  });

  // ── Asignar cursos al docente ──
  const docente = await prisma.docente.findUniqueOrThrow({ where: { usuarioId: docenteUser.id } });
  const asignaciones: { cursoNombre: string; gradoId: string; seccionNombre: string }[] = [
    { cursoNombre: 'Matemática', gradoId: 'primaria-3ro', seccionNombre: 'A' },
    { cursoNombre: 'Comunicación', gradoId: 'primaria-4to', seccionNombre: 'B' },
    { cursoNombre: 'Ciencia y Tecnología', gradoId: 'primaria-3ro', seccionNombre: 'A' },
    { cursoNombre: 'Inglés', gradoId: 'primaria-5to', seccionNombre: 'A' },
    { cursoNombre: 'Educación Física', gradoId: 'primaria-2do', seccionNombre: 'A' },
  ];

  for (const a of asignaciones) {
    const curso = await prisma.curso.findFirst({ where: { nombre: a.cursoNombre } });
    const seccion = await prisma.seccion.findUnique({
      where: { gradoId_nombre_anioEscolar: { gradoId: a.gradoId, nombre: a.seccionNombre, anioEscolar: ANIO_ESCOLAR_ACTUAL } },
    });
    if (curso && seccion) {
      await prisma.docenteCursoSeccion.upsert({
        where: { docenteId_cursoId_seccionId: { docenteId: docente.id, cursoId: curso.id, seccionId: seccion.id } },
        update: {},
        create: { docenteId: docente.id, cursoId: curso.id, seccionId: seccion.id },
      });
    }
  }

  // ── Estudiantes de prueba ──
  const estudiantesData = [
    { email: 'alumno1@educore.test', nombres: 'Luis', apellidos: 'García', dni: '87654321' },
    { email: 'alumno2@educore.test', nombres: 'María', apellidos: 'López', dni: '87654322' },
    { email: 'alumno3@educore.test', nombres: 'Carlos', apellidos: 'Ramírez', dni: '87654323' },
    { email: 'alumno4@educore.test', nombres: 'Ana', apellidos: 'Torres', dni: '87654324' },
  ];

  for (const e of estudiantesData) {
    const usuario = await prisma.usuario.upsert({
      where: { email: e.email },
      update: {},
      create: { email: e.email, passwordHash, rol: 'ESTUDIANTE', dosFaActivo: false },
    });
    await prisma.estudiante.upsert({
      where: { usuarioId: usuario.id },
      update: {},
      create: {
        usuarioId: usuario.id,
        nombres: e.nombres,
        apellidos: e.apellidos,
        dni: e.dni,
        fechaNacimiento: new Date('2010-01-01'),
      },
    });
  }

  // ── Matricular estudiantes ──
  const seccion3roA = await prisma.seccion.findUnique({
    where: { gradoId_nombre_anioEscolar: { gradoId: 'primaria-3ro', nombre: 'A', anioEscolar: ANIO_ESCOLAR_ACTUAL } },
  });
  const seccion4toB = await prisma.seccion.findUnique({
    where: { gradoId_nombre_anioEscolar: { gradoId: 'primaria-4to', nombre: 'B', anioEscolar: ANIO_ESCOLAR_ACTUAL } },
  });
  const seccion5toA = await prisma.seccion.findUnique({
    where: { gradoId_nombre_anioEscolar: { gradoId: 'primaria-5to', nombre: 'A', anioEscolar: ANIO_ESCOLAR_ACTUAL } },
  });

  const luis = await prisma.estudiante.findUnique({ where: { dni: '87654321' } });
  const maria = await prisma.estudiante.findUnique({ where: { dni: '87654322' } });
  const carlos = await prisma.estudiante.findUnique({ where: { dni: '87654323' } });
  const ana = await prisma.estudiante.findUnique({ where: { dni: '87654324' } });

  const matriculas = [
    { estudiante: luis, seccion: seccion3roA },
    { estudiante: carlos, seccion: seccion3roA },
    { estudiante: maria, seccion: seccion4toB },
    { estudiante: ana, seccion: seccion5toA },
  ];
  for (const m of matriculas) {
    if (m.estudiante && m.seccion) {
      const existe = await prisma.matricula.findFirst({
        where: { estudianteId: m.estudiante.id, seccionId: m.seccion.id, anioEscolar: ANIO_ESCOLAR_ACTUAL },
      });
      if (!existe) {
        await prisma.matricula.create({
          data: { estudianteId: m.estudiante.id, seccionId: m.seccion.id, anioEscolar: ANIO_ESCOLAR_ACTUAL, estado: 'ACTIVA' },
        });
      }
    }
  }

  console.log('Usuarios de prueba creados. Contraseña para ambos: Password123!');
  console.log('Grados y secciones del año', ANIO_ESCOLAR_ACTUAL, 'creados.');
  console.log('Docente Juan Pérez creado con 5 asignaciones.');
  console.log('4 estudiantes matriculados en secciones.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });