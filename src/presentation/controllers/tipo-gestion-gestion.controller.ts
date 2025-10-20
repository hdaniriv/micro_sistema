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

interface CreateTipoGestionDto {
  nombre: string;
  descripcion?: string;
}

interface UpdateTipoGestionDto extends Partial<CreateTipoGestionDto> {}

@ApiTags('Gestión')
@Controller('gestion/tipo-gestiones')
export class TipoGestionGestionController {
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
    const msg = 'Error comunicando con MS Gestión (tipo-gestiones)';
    this.logger.logError(err, msg, where);
    if (err?.name === 'TimeoutError') {
      throw new GatewayTimeoutException('Gestión no respondió a tiempo');
    }
    if (err?.status === 404) {
      throw new NotFoundException(err?.message || 'TipoGestion no encontrado');
    }
    throw new ServiceUnavailableException('Gestión no disponible');
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de gestión' })
  @ApiOkResponse({ description: 'Listado de tipos de gestión' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte', 'Cliente', 'Técnico')
  async findAll() {
    const pattern = { cmd: 'tipoGestiones.findAll.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, {}));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'TipoGestionGestionController.findAll');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de gestión por ID' })
  @ApiOkResponse({ description: 'Tipo de gestión' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte', 'Cliente', 'Técnico')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const pattern = { cmd: 'tipoGestiones.findById.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, { id }));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'TipoGestionGestionController.findById');
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear tipo de gestión' })
  @ApiBody({
    schema: {
      properties: {
        nombre: { type: 'string' },
        descripcion: { type: 'string' },
      },
      required: ['nombre'],
    },
  })
  async create(@Body() dto: CreateTipoGestionDto, @Request() req: any) {
    const pattern = { cmd: 'tipoGestiones.create.v1' };
    const payload = { dto, userContext: this.userContextFrom(req) };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, payload));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'TipoGestionGestionController.create');
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({ summary: 'Actualizar tipo de gestión' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoGestionDto
  ) {
    const pattern = { cmd: 'tipoGestiones.update.v1' };
    try {
      const obs$ = this.withTimeout(
        this.gestionClient.send(pattern, { id, dto })
      );
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'TipoGestionGestionController.update');
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @ApiOperation({ summary: 'Eliminar tipo de gestión' })
  @ApiOkResponse({ description: 'Tipo de gestión eliminado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const pattern = { cmd: 'tipoGestiones.delete.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, { id }));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'TipoGestionGestionController.remove');
    }
  }
}
