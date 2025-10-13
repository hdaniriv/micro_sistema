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
  @Roles('Administrador', 'Supervisor', 'Soporte')
  async findAll() {
    const pattern = { cmd: 'gestiones.findAll.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, {}));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'GestionGestionController.findAll');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener gestión por ID' })
  @ApiOkResponse({ description: 'Gestión' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte')
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
  @Roles('Administrador', 'Supervisor')
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
    const payload = { dto, userContext: this.userContextFrom(req) };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, payload));
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
    @Body() dto: UpdateGestionDto
  ) {
    const pattern = { cmd: 'gestiones.update.v1' };
    try {
      const obs$ = this.withTimeout(
        this.gestionClient.send(pattern, { id, dto })
      );
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'GestionGestionController.update');
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
