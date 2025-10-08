import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RolResponseDto {
  @ApiProperty({
    description: 'ID único del rol',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
  })
  @Expose()
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del rol',
    example: 'Acceso completo al sistema',
  })
  @Expose()
  descripcion?: string;

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
}
