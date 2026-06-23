// src/modules/estudiante/business/estudiante.service.ts
// Capa de Negocio: reglas del módulo Estudiante. No conoce HTTP ni SQL (sección 1, capa Negocio).
import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ESTUDIANTE_REPOSITORY,
  IEstudianteRepository,
} from '../data/estudiante.repository.interface';
import {
  DniDuplicadoException,
  EmailDuplicadoException,
  EstudianteNoEncontradoException,
} from './exceptions/estudiante.exceptions';

const SALT_ROUNDS = 10;

interface CrearEstudianteInput {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: Date;
}

@Injectable()
export class EstudianteService {
  constructor(
    @Inject(ESTUDIANTE_REPOSITORY) private readonly estudianteRepository: IEstudianteRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * POST /api/estudiantes
   * Crea el Usuario (rol ESTUDIANTE) y el registro académico en una sola operación.
   */
  async crear(input: CrearEstudianteInput) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email: input.email },
    });
    if (usuarioExistente) throw new EmailDuplicadoException();

    const dniExistente = await this.estudianteRepository.buscarPorDni(input.dni);
    if (dniExistente) throw new DniDuplicadoException();

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const usuario = await this.prisma.usuario.create({
      data: { email: input.email, passwordHash, rol: 'ESTUDIANTE' },
    });

    return this.estudianteRepository.crear({
      usuarioId: usuario.id,
      nombres: input.nombres,
      apellidos: input.apellidos,
      dni: input.dni,
      fechaNacimiento: input.fechaNacimiento,
    });
  }

  /** GET /api/estudiantes/:id */
  async buscarPorId(id: string) {
    const estudiante = await this.estudianteRepository.buscarPorId(id);
    if (!estudiante) throw new EstudianteNoEncontradoException();
    return estudiante;
  }

  /** GET /api/estudiantes */
  async listarTodos() {
    return this.estudianteRepository.listarTodos();
  }

  /** PATCH /api/estudiantes/:id */
  async actualizar(id: string, data: Partial<Omit<CrearEstudianteInput, 'email' | 'password'>>) {
    await this.buscarPorId(id);
    return this.estudianteRepository.actualizar(id, data);
  }

  /** DELETE /api/estudiantes/:id */
  async eliminar(id: string) {
    await this.buscarPorId(id);
    return this.estudianteRepository.eliminar(id);
  }
}