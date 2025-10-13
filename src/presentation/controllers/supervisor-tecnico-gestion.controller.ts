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

interface CreateSupervisorTecnicoDto {
  idSupervisor: number;
  idTecnico: number;
}

interface UpdateSupervisorTecnicoDto
  extends Partial<CreateSupervisorTecnicoDto> {}

@ApiTags('Gestión')
@Controller('gestion/supervisores-tecnicos')
export class SupervisorTecnicoGestionController {
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
    const msg = 'Error comunicando con MS Gestión (supervisores-técnicos)';
    this.logger.logError(err, msg, where);
    if (err?.name === 'TimeoutError') {
      throw new GatewayTimeoutException('Gestión no respondió a tiempo');
    }
    if (err?.status === 404) {
      throw new NotFoundException(err?.message || 'Relación no encontrada');
    }
    throw new ServiceUnavailableException('Gestión no disponible');
  }

  @Get()
  @ApiOperation({ summary: 'Listar relaciones supervisor-técnico' })
  @ApiOkResponse({ description: 'Listado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte')
  async findAll() {
    const pattern = { cmd: 'supervisoresTecnicos.findAll.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, {}));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'SupervisorTecnicoGestionController.findAll');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener relación por ID' })
  @ApiOkResponse({ description: 'Relación' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const pattern = { cmd: 'supervisoresTecnicos.findById.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, { id }));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'SupervisorTecnicoGestionController.findById');
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear relación supervisor-técnico' })
  @ApiBody({
    schema: {
      properties: {
        idSupervisor: { type: 'number' },
        idTecnico: { type: 'number' },
      },
      required: ['idSupervisor', 'idTecnico'],
    },
  })
  async create(@Body() dto: CreateSupervisorTecnicoDto, @Request() req: any) {
    const pattern = { cmd: 'supervisoresTecnicos.create.v1' };
    const payload = { dto, userContext: this.userContextFrom(req) };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, payload));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'SupervisorTecnicoGestionController.create');
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({ summary: 'Actualizar relación supervisor-técnico' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupervisorTecnicoDto
  ) {
    const pattern = { cmd: 'supervisoresTecnicos.update.v1' };
    try {
      const obs$ = this.withTimeout(
        this.gestionClient.send(pattern, { id, dto })
      );
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'SupervisorTecnicoGestionController.update');
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @ApiOperation({ summary: 'Eliminar relación supervisor-técnico' })
  @ApiOkResponse({ description: 'Eliminado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const pattern = { cmd: 'supervisoresTecnicos.delete.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, { id }));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'SupervisorTecnicoGestionController.remove');
    }
  }
}
