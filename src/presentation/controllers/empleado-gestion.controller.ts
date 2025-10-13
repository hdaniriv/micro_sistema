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

interface CreateEmpleadoDto {
  nombres: string;
  apellidos: string;
  telefono?: string;
  direccion?: string;
  idEmpleadoTipo: number;
  idUsuario?: number;
}

interface UpdateEmpleadoDto extends Partial<CreateEmpleadoDto> {}

@ApiTags('Gestión')
@Controller('gestion/empleados')
export class EmpleadoGestionController {
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
    const msg = 'Error comunicando con MS Gestión (empleados)';
    this.logger.logError(err, msg, where);
    if (err?.name === 'TimeoutError') {
      throw new GatewayTimeoutException('Gestión no respondió a tiempo');
    }
    if (err?.status === 404) {
      throw new NotFoundException(err?.message || 'Empleado no encontrado');
    }
    throw new ServiceUnavailableException('Gestión no disponible');
  }

  @Get()
  @ApiOperation({ summary: 'Listar empleados' })
  @ApiOkResponse({ description: 'Listado de empleados' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte')
  async findAll() {
    const pattern = { cmd: 'empleados.findAll.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, {}));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'EmpleadoGestionController.findAll');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener empleado por ID' })
  @ApiOkResponse({ description: 'Empleado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const pattern = { cmd: 'empleados.findById.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, { id }));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'EmpleadoGestionController.findById');
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear empleado' })
  @ApiBody({
    schema: {
      properties: {
        nombres: { type: 'string' },
        apellidos: { type: 'string' },
        telefono: { type: 'string' },
        direccion: { type: 'string' },
        idEmpleadoTipo: { type: 'number' },
        idUsuario: { type: 'number' },
      },
      required: ['nombres', 'apellidos', 'idEmpleadoTipo'],
    },
  })
  async create(@Body() dto: CreateEmpleadoDto, @Request() req: any) {
    const pattern = { cmd: 'empleados.create.v1' };
    const payload = { dto, userContext: this.userContextFrom(req) };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, payload));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'EmpleadoGestionController.create');
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({ summary: 'Actualizar empleado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmpleadoDto
  ) {
    const pattern = { cmd: 'empleados.update.v1' };
    try {
      const obs$ = this.withTimeout(
        this.gestionClient.send(pattern, { id, dto })
      );
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'EmpleadoGestionController.update');
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @ApiOperation({ summary: 'Eliminar empleado' })
  @ApiOkResponse({ description: 'Empleado eliminado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const pattern = { cmd: 'empleados.delete.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, { id }));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'EmpleadoGestionController.remove');
    }
  }
}
