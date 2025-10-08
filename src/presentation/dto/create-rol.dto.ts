import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRolDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del rol',
    example: 'Acceso completo al sistema',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}
