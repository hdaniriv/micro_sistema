import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
    maxLength: 50,
  })
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
  @MaxLength(50, {
    message: 'El nombre del rol no puede superar 50 caracteres',
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del rol',
    example: 'Acceso completo al sistema',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(200, { message: 'La descripción no puede superar 200 caracteres' })
  descripcion?: string;
}
