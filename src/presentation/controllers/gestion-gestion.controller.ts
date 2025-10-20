import {
  Body,
  Controller,
  Delete,
  GatewayTimeoutException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { GESTION_MS } from '../../application/microservices.module';
import { CustomLoggerService } from '../../shared/utils/logger.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../guards';

interface CreateGestionDto {
  idCliente: number;
  idTecnico?: number;
  idTipoGestion: number;
  direccion: string;
  latitud?: string;
  longitud?: string;
  fechaProgramada?: string;
  fechaInicio?: string;
  fechaFin?: string;
  observaciones?: string;
  estado?: string;
}

interface UpdateGestionDto extends Partial<CreateGestionDto> {}

@ApiTags('Gestión')
@Controller('gestion/gestiones')
export class GestionGestionController {
  constructor(
    @Inject(GESTION_MS) private readonly gestionClient: ClientProxy,
    private readonly logger: CustomLoggerService,
    private readonly config: ConfigService
  ) {}

  private withTimeout<T>(obs: any) {
    const timeoutMs = Number(this.config.get('GESTION_MS_TIMEOUT') || 5000);
    return obs.pipe(timeout(timeoutMs));
  }

  private userContextFrom(req: any) {
    const user = req.user;
    return {
      userId: user?.sub,
      roles: user?.roles || [],
      username: user?.username,
      traceId: req.headers['x-trace-id'] || undefined,
    };
  }

  private handleError(err: any, where: string) {
    const msg = 'Error comunicando con MS Gestión (gestiones)';
    this.logger.logError(err, msg, where);
    if (err?.name === 'TimeoutError') {
      throw new GatewayTimeoutException('Gestión no respondió a tiempo');
    }
    if (err?.status === 404) {
      throw new NotFoundException(err?.message || 'Gestión no encontrada');
    }
    throw new ServiceUnavailableException('Gestión no disponible');
  }

  @Get()
  @ApiOperation({ summary: 'Listar gestiones' })
  @ApiOkResponse({ description: 'Listado de gestiones' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte', 'Técnico', 'Cliente')
  async findAll() {
    const pattern = { cmd: 'gestiones.findAll.v1' };
    try {
      // Nota: hoy no filtramos por usuario/rol. En una siguiente iteración
      // podríamos enviar userContext y que el MS filtre por idCliente (rol Cliente)
      // o por técnico asignado (rol Técnico).
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, {}));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'GestionGestionController.findAll');
    }
  }

  // Nuevos endpoints de filtrado/consulta avanzada
  @Get('search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Técnico', 'Cliente')
  @ApiOperation({
    summary: 'Buscar gestiones con filtros',
    description:
      'Permite filtrar por asignación (sin-tecnico|con-tecnico), estado (finalizadas|no-finalizadas), rango de fechas (desde|hasta). Aplica reglas por rol: Admin ve todo; Supervisor ve sin técnico y de sus técnicos; Técnico ve las propias; Cliente ve las suyas.',
  })
  @ApiOkResponse({ description: 'Listado de gestiones filtrado' })
  async search(@Request() req: any) {
    const { query } = req;
    const pickOne = (v: any) => (Array.isArray(v) ? v[0] : v);
    const normalizeDate = (v: any): string | undefined => {
      const s = (v ?? '').toString().trim();
      if (!s) return undefined;
      const low = s.toLowerCase();
      if (low === 'null' || low === 'undefined' || low === 'invalid date')
        return undefined;
      // Acepta YYYY-MM-DD o ISO 8601 extendido
      const isoLike =
        /^(\d{4}-\d{2}-\d{2})(?:[ tT]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/;
      if (!isoLike.test(s)) return undefined;
      // Si viene sólo fecha, retornamos tal cual; si viene con hora/offset, también es válido
      return s;
    };
    const asignacion = pickOne(query?.asignacion);
    const estadoFinalizacion = pickOne(query?.estadoFinalizacion);
    const desde = normalizeDate(pickOne(query?.desde));
    const hasta = normalizeDate(pickOne(query?.hasta));
    const idTipoGestionRaw = pickOne(query?.idTipoGestion);
    const estado = pickOne(query?.estado);
    const idClienteRaw = pickOne(query?.idCliente);
    const idTecnicoRaw = pickOne(query?.idTecnico);
    const q: any = {
      asignacion: asignacion || undefined,
      estadoFinalizacion: estadoFinalizacion || undefined,
      desde: desde || undefined,
      hasta: hasta || undefined,
      idTipoGestion: idTipoGestionRaw ? Number(idTipoGestionRaw) : undefined,
      estado: estado || undefined,
    };
    // Pasar hints para el MS: idCliente/idTecnico según rol
    const roles: string[] = req.user?.roles || [];
    if (roles.includes('Técnico') || roles.includes('Tecnico')) {
      // Esperamos idTecnico por query o mapeo futuro por usuario
      if (idTecnicoRaw) q.idTecnico = Number(idTecnicoRaw);
    }
    if (roles.includes('Cliente')) {
      if (idClienteRaw) q.idCliente = Number(idClienteRaw);
    }

    const pattern = { cmd: 'gestiones.search.v1' };
    const payload = { query: q, userContext: this.userContextFrom(req) };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, payload));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'GestionGestionController.search');
    }
  }

  @Get('sin-tecnico')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({ summary: 'Listar gestiones sin técnico asignado' })
  async sinTecnico(@Request() req: any) {
    const pattern = { cmd: 'gestiones.sinTecnico.v1' };
    const q = { desde: req.query?.desde, hasta: req.query?.hasta };
    try {
      const obs$ = this.withTimeout(
        this.gestionClient.send(pattern, { query: q })
      );
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'GestionGestionController.sinTecnico');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener gestión por ID' })
  @ApiOkResponse({ description: 'Gestión' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte', 'Técnico', 'Cliente')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const pattern = { cmd: 'gestiones.findById.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, { id }));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'GestionGestionController.findById');
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Cliente')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear gestión' })
  @ApiBody({
    schema: {
      properties: {
        idCliente: { type: 'number' },
        idTecnico: { type: 'number' },
        idTipoGestion: { type: 'number' },
        direccion: { type: 'string' },
        latitud: { type: 'string' },
        longitud: { type: 'string' },
        fechaProgramada: { type: 'string', format: 'date-time' },
        fechaInicio: { type: 'string', format: 'date-time' },
        fechaFin: { type: 'string', format: 'date-time' },
        observaciones: { type: 'string' },
        estado: { type: 'string' },
      },
      required: ['idCliente', 'idTipoGestion', 'direccion'],
    },
  })
  async create(@Body() dto: CreateGestionDto, @Request() req: any) {
    const pattern = { cmd: 'gestiones.create.v1' };
    const userContext = this.userContextFrom(req);
    const roles: string[] = req.user?.roles || [];
    const isCliente = roles.includes('Cliente');
    try {
      let payloadDto = { ...dto } as any;
      if (isCliente) {
        // Resolver cliente asociado al usuario actual y forzar idCliente
        const findClientePattern = { cmd: 'clientes.findByUsuario.v1' };
        const selfCliente: any = await firstValueFrom(
          this.withTimeout(
            this.gestionClient.send(findClientePattern, {
              idUsuario: req.user?.sub,
            })
          )
        );
        if (!selfCliente?.id) {
          return {
            statusCode: 400,
            message:
              'Debes completar tus datos de cliente antes de crear una gestión',
          };
        }
        payloadDto.idCliente = selfCliente.id;
        // Un cliente no debería asignar técnico directamente
        payloadDto.idTecnico = undefined;
      }
      const obs$ = this.withTimeout(
        this.gestionClient.send(pattern, { dto: payloadDto, userContext })
      );
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'GestionGestionController.create');
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({ summary: 'Actualizar gestión' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGestionDto,
    @Request() req: any
  ) {
    const pattern = { cmd: 'gestiones.update.v1' };
    try {
      const obs$ = this.withTimeout(
        this.gestionClient.send(pattern, {
          id,
          dto,
          userContext: this.userContextFrom(req),
        })
      );
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'GestionGestionController.update');
    }
  }

  @Patch(':id/asignacion')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Técnico')
  @ApiOperation({ summary: 'Asignar técnico y fechas (inicio/fin)' })
  async asignacion(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    dto: {
      idTecnico?: number;
      fechaInicio?: string;
      fechaFin?: string;
    },
    @Request() req: any
  ) {
    const pattern = { cmd: 'gestiones.update.v1' };
    try {
      const obs$ = this.withTimeout(
        this.gestionClient.send(pattern, {
          id,
          dto,
          userContext: this.userContextFrom(req),
        })
      );
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'GestionGestionController.asignacion');
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @ApiOperation({ summary: 'Eliminar gestión' })
  @ApiOkResponse({ description: 'Gestión eliminada' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const pattern = { cmd: 'gestiones.delete.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, { id }));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'GestionGestionController.remove');
    }
  }
}
