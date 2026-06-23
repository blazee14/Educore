-- CreateEnum
CREATE TYPE "NivelEducativo" AS ENUM ('PRIMARIA', 'SECUNDARIA');

-- CreateEnum
CREATE TYPE "EstadoMatricula" AS ENUM ('PENDIENTE', 'ACTIVA', 'RETIRADA', 'FINALIZADA');

-- CreateTable
CREATE TABLE "estudiante" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "telefono" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudiante_tutor" (
    "id" TEXT NOT NULL,
    "estudiante_id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "parentesco" TEXT NOT NULL,

    CONSTRAINT "estudiante_tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grado" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" "NivelEducativo" NOT NULL,

    CONSTRAINT "grado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seccion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "grado_id" TEXT NOT NULL,
    "anio_escolar" INTEGER NOT NULL,

    CONSTRAINT "seccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matricula" (
    "id" TEXT NOT NULL,
    "estudiante_id" TEXT NOT NULL,
    "seccion_id" TEXT NOT NULL,
    "anio_escolar" INTEGER NOT NULL,
    "estado" "EstadoMatricula" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_matricula" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matricula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estudiante_usuario_id_key" ON "estudiante"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "estudiante_dni_key" ON "estudiante"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_usuario_id_key" ON "tutor"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_dni_key" ON "tutor"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "estudiante_tutor_estudiante_id_tutor_id_key" ON "estudiante_tutor"("estudiante_id", "tutor_id");

-- CreateIndex
CREATE UNIQUE INDEX "seccion_grado_id_nombre_anio_escolar_key" ON "seccion"("grado_id", "nombre", "anio_escolar");

-- AddForeignKey
ALTER TABLE "estudiante" ADD CONSTRAINT "estudiante_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor" ADD CONSTRAINT "tutor_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante_tutor" ADD CONSTRAINT "estudiante_tutor_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "estudiante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante_tutor" ADD CONSTRAINT "estudiante_tutor_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seccion" ADD CONSTRAINT "seccion_grado_id_fkey" FOREIGN KEY ("grado_id") REFERENCES "grado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
