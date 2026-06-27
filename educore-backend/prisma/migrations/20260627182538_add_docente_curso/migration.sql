-- CreateTable
CREATE TABLE "curso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" "NivelEducativo" NOT NULL,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docente" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "telefono" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "docente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docente_curso_seccion" (
    "id" TEXT NOT NULL,
    "docente_id" TEXT NOT NULL,
    "curso_id" TEXT NOT NULL,
    "seccion_id" TEXT NOT NULL,

    CONSTRAINT "docente_curso_seccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "docente_usuario_id_key" ON "docente"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "docente_dni_key" ON "docente"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "docente_curso_seccion_docente_id_curso_id_seccion_id_key" ON "docente_curso_seccion"("docente_id", "curso_id", "seccion_id");

-- AddForeignKey
ALTER TABLE "docente" ADD CONSTRAINT "docente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docente_curso_seccion" ADD CONSTRAINT "docente_curso_seccion_docente_id_fkey" FOREIGN KEY ("docente_id") REFERENCES "docente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docente_curso_seccion" ADD CONSTRAINT "docente_curso_seccion_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docente_curso_seccion" ADD CONSTRAINT "docente_curso_seccion_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "seccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
