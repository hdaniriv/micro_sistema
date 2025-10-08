import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RolService } from '../../application/roles/rol.service';
import { CreateRolDto, UpdateRolDto, RolResponseDto } from '../dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../guards';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({
    summary: 'Obtener todos los roles',
    description: 'Retorna una lista con todos los roles del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente',
    type: [RolResponseDto],
  })
  async findAll(): Promise<RolResponseDto[]> {
    return this.rolService.findAll();
  }

  @Get('system')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({
    summary: 'Obtener roles del sistema',
    description: 'Retorna una lista con los roles predefinidos del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles del sistema obtenida exitosamente',
    type: [RolResponseDto],
  })
  async findSystemRoles(): Promise<RolResponseDto[]> {
    return this.rolService.findSystemRoles();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({
    summary: 'Obtener rol por ID',
    description: 'Retorna la información de un rol específico',
  })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado',
    type: RolResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<RolResponseDto> {
    return this.rolService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  @ApiOperation({
    summary: 'Crear nuevo rol',
    description: 'Crea un nuevo rol en el sistema',
  })
  @ApiBody({ type: CreateRolDto })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    type: RolResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un rol con este nombre',
  })
  async create(
    @Body() createRolDto: CreateRolDto,
    @Request() req: any
  ): Promise<RolResponseDto> {
    return this.rolService.create(createRolDto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  @ApiOperation({
    summary: 'Actualizar rol',
    description: 'Actualiza la información de un rol existente',
  })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiBody({ type: UpdateRolDto })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    type: RolResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRolDto: UpdateRolDto
  ): Promise<RolResponseDto> {
    return this.rolService.update(id, updateRolDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  @ApiOperation({
    summary: 'Eliminar rol',
    description:
      'Elimina un rol del sistema (no se pueden eliminar roles del sistema)',
  })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar un rol del sistema',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.rolService.delete(id);
  }
}
