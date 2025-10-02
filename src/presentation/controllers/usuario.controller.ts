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
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { UsuarioService } from '../../application/users/usuario.service';
import { 
  CreateUsuarioDto, 
  UpdateUsuarioDto, 
  UsuarioResponseDto,
  ChangePasswordDto,
  AssignRoleDto 
} from '../dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../guards';

@ApiTags('Usuarios')
@Controller('usuarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios',
    description: 'Retorna una lista con todos los usuarios del sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    type: [UsuarioResponseDto],
  })
  async findAll(): Promise<UsuarioResponseDto[]> {
    return this.usuarioService.findAll();
  }

  @Get('active')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({ 
    summary: 'Obtener usuarios activos',
    description: 'Retorna una lista con todos los usuarios activos del sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios activos obtenida exitosamente',
    type: [UsuarioResponseDto],
  })
  async findActiveUsers(): Promise<UsuarioResponseDto[]> {
    return this.usuarioService.findActiveUsers();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({ 
    summary: 'Obtener usuario por ID',
    description: 'Retorna la información de un usuario específico'
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UsuarioResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UsuarioResponseDto> {
    return this.usuarioService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  @ApiOperation({ 
    summary: 'Crear nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema'
  })
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UsuarioResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya existe',
  })
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Request() req: any
  ): Promise<UsuarioResponseDto> {
    return this.usuarioService.create(createUsuarioDto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  @ApiOperation({ 
    summary: 'Actualizar usuario',
    description: 'Actualiza la información de un usuario existente'
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UsuarioResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto
  ): Promise<UsuarioResponseDto> {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  @ApiOperation({ 
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario del sistema'
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usuarioService.delete(id);
  }

  @Post('assign-role')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  @ApiOperation({ 
    summary: 'Asignar rol a usuario',
    description: 'Asigna un rol específico a un usuario'
  })
  @ApiBody({ type: AssignRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Rol asignado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o rol no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya tiene asignado este rol',
  })
  async assignRole(
    @Body() assignRoleDto: AssignRoleDto,
    @Request() req: any
  ): Promise<void> {
    return this.usuarioService.assignRole(
      assignRoleDto.idUsuario, 
      assignRoleDto.idRol, 
      req.user.sub
    );
  }

  @Delete(':userId/roles/:roleId')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  @ApiOperation({ 
    summary: 'Remover rol de usuario',
    description: 'Remueve un rol específico de un usuario'
  })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiParam({ name: 'roleId', description: 'ID del rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol removido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario no tiene asignado este rol',
  })
  async removeRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number
  ): Promise<void> {
    return this.usuarioService.removeRole(userId, roleId);
  }

  @Post('change-password')
  @ApiOperation({ 
    summary: 'Cambiar contraseña',
    description: 'Permite al usuario cambiar su contraseña'
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'La contraseña actual es incorrecta',
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: any
  ): Promise<void> {
    return this.usuarioService.changePassword(req.user.sub, changePasswordDto);
  }

  @Get(':id/roles')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Supervisor')
  @ApiOperation({ 
    summary: 'Obtener roles de usuario',
    description: 'Retorna los roles asignados a un usuario específico'
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Roles del usuario obtenidos exitosamente',
    type: [String],
  })
  async getUserRoles(@Param('id', ParseIntPipe) id: number): Promise<string[]> {
    return this.usuarioService.getUserRoles(id);
  }
}