import { ApiProperty } from '@nestjs/swagger';
import { UsuarioResponseDto } from './usuario-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token de refresco',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Tipo de token',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'Tiempo de expiración en segundos',
    example: 86400,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: UsuarioResponseDto,
  })
  user: UsuarioResponseDto;
}
