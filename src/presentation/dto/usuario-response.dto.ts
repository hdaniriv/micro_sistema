import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UsuarioResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'usuario123',
  })
  @Expose()
  username: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'usuario@email.com',
  })
  @Expose()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @Expose()
  nombre?: string;

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true,
  })
  @Expose()
  activo: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  fechaCreacion: Date;

  @ApiProperty({
    description: 'Fecha de última modificación',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  fechaModificacion: Date;

  @Exclude()
  password: string;

  @Exclude()
  idUsuarioCreador?: number;
}
