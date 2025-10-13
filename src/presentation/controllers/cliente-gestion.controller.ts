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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { GESTION_MS } from '../../application/microservices.module';
import { CustomLoggerService } from '../../shared/utils/logger.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../guards';

interface CreateClienteDto {
  nombre: string;
  correo: string;
  direccion?: string;
  nit?: string;
}

interface UpdateClienteDto extends Partial<CreateClienteDto> {}

@ApiTags('Gestión')
@Controller('gestion/clientes')
export class ClienteGestionController {
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
    const msg = 'Error comunicando con MS Gestión (clientes)';
    this.logger.logError(err, msg, where);
    if (err?.name === 'TimeoutError') {
      throw new GatewayTimeoutException('Gestión no respondió a tiempo');
    }
    // Si el MS propaga excepciones HTTP, intentar respetar NotFound
    if (err?.status === 404) {
      throw new NotFoundException(err?.message || 'Cliente no encontrado');
    }
    throw new ServiceUnavailableException('Gestión no disponible');
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes (proxy a MS Gestión)' })
  @ApiOkResponse({
    description: 'Listado de clientes',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          nombre: { type: 'string' },
          correo: { type: 'string' },
          direccion: { type: 'string', nullable: true },
          nit: { type: 'string', nullable: true },
          fechaCreacion: { type: 'string', format: 'date-time' },
          fechaModificacion: { type: 'string', format: 'date-time' },
          idUsuarioCreador: { type: 'number', nullable: true },
        },
      },
    },
  })
  @ApiResponse({ status: 503, description: 'Gestión no disponible' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte')
  async findAll(@Request() req: any) {
    const pattern = { cmd: 'clientes.findAll.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, {}));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'ClienteGestionController.findAll');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID (proxy a MS Gestión)' })
  @ApiOkResponse({
    description: 'Cliente encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        nombre: { type: 'string' },
        correo: { type: 'string' },
        direccion: { type: 'string', nullable: true },
        nit: { type: 'string', nullable: true },
        fechaCreacion: { type: 'string', format: 'date-time' },
        fechaModificacion: { type: 'string', format: 'date-time' },
        idUsuarioCreador: { type: 'number', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 503, description: 'Gestión no disponible' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor', 'Soporte')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const pattern = { cmd: 'clientes.findById.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, { id }));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'ClienteGestionController.findById');
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear cliente (proxy a MS Gestión)' })
  @ApiBody({
    schema: {
      properties: {
        nombre: { type: 'string' },
        correo: { type: 'string', format: 'email' },
        direccion: { type: 'string' },
        nit: { type: 'string' },
      },
      required: ['nombre', 'correo'],
      example: {
        nombre: 'ACME SRL',
        correo: 'contacto@acme.test',
        direccion: 'Av. 123',
        nit: '1234567-8',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        nombre: { type: 'string' },
        correo: { type: 'string' },
        direccion: { type: 'string', nullable: true },
        nit: { type: 'string', nullable: true },
        fechaCreacion: { type: 'string', format: 'date-time' },
        fechaModificacion: { type: 'string', format: 'date-time' },
        idUsuarioCreador: { type: 'number', nullable: true },
      },
      example: {
        id: 1,
        nombre: 'ACME SRL',
        correo: 'contacto@acme.test',
        direccion: 'Av. 123',
        nit: '1234567-8',
        fechaCreacion: '2025-10-10T10:00:00.000Z',
        fechaModificacion: '2025-10-10T10:00:00.000Z',
        idUsuarioCreador: 42,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 503, description: 'Gestión no disponible' })
  @ApiResponse({ status: 504, description: 'Gestión no respondió a tiempo' })
  async create(@Body() dto: CreateClienteDto, @Request() req: any) {
    const pattern = { cmd: 'clientes.create.v1' };
    const payload = { dto, userContext: this.userContextFrom(req) };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, payload));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'ClienteGestionController.create');
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({ summary: 'Actualizar cliente (proxy a MS Gestión)' })
  @ApiBody({
    schema: {
      properties: {
        nombre: { type: 'string' },
        correo: { type: 'string', format: 'email' },
        direccion: { type: 'string' },
        nit: { type: 'string' },
      },
      example: {
        direccion: 'Calle Nueva 999',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 503, description: 'Gestión no disponible' })
  @ApiResponse({ status: 504, description: 'Gestión no respondió a tiempo' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClienteDto
  ) {
    const pattern = { cmd: 'clientes.update.v1' };
    try {
      const obs$ = this.withTimeout(
        this.gestionClient.send(pattern, { id, dto })
      );
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'ClienteGestionController.update');
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @ApiOperation({ summary: 'Eliminar cliente (proxy a MS Gestión)' })
  @ApiOkResponse({
    description: 'Cliente eliminado',
    schema: {
      type: 'object',
      properties: { deleted: { type: 'boolean', example: true } },
    },
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 503, description: 'Gestión no disponible' })
  @ApiResponse({ status: 504, description: 'Gestión no respondió a tiempo' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const pattern = { cmd: 'clientes.delete.v1' };
    try {
      const obs$ = this.withTimeout(this.gestionClient.send(pattern, { id }));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      this.handleError(err, 'ClienteGestionController.remove');
    }
  }
}
