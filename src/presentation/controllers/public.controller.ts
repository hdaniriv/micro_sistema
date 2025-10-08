import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsuarioService } from '../../application/users/usuario.service';
import { RolService } from '../../application/roles/rol.service';
import { CreateUsuarioDto, UsuarioResponseDto } from '../dto';

@ApiTags('Registro Público')
@Controller('public')
export class PublicController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly rolService: RolService
  ) {}

  @Post('register/cliente')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registro público de cliente',
    description:
      'Permite a cualquier persona registrarse como cliente en el sistema',
  })
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({
    status: 201,
    description: 'Cliente registrado exitosamente',
    type: UsuarioResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya existe',
  })
  async registerCliente(
    @Body() createUsuarioDto: CreateUsuarioDto
  ): Promise<UsuarioResponseDto> {
    // Crear el usuario
    const newUser = await this.usuarioService.create(createUsuarioDto);

    // Buscar el rol de Cliente
    const clienteRole = await this.rolService.findByName('Cliente');
    if (clienteRole) {
      // Asignar automáticamente el rol de Cliente
      await this.usuarioService.assignRole(newUser.id, clienteRole.id);
    }

    return newUser;
  }
}
