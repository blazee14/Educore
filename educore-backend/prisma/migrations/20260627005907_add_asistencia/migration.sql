-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('PRESENTE', 'TARDANZA', 'FALTA');

-- CreateTable
CREATE TABLE "asistencia" (
    "id" TEXT NOT NULL,
    "estudiante_id" TEXT NOT NULL,
    "seccion_id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "estado" "EstadoAsistencia" NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "asistencia_estudiante_id_fecha_key" ON "asistencia"("estudiante_id", "fecha");

-- AddForeignKey
ALTER TABLE "asistencia" ADD CONSTRAINT "asistencia_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "estudiante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencia" ADD CONSTRAINT "asistencia_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "seccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
