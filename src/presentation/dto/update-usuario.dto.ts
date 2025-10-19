import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'usuario@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value
  )
  @MaxLength(100, {
    message: 'El correo electrónico no puede superar 100 caracteres',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Estado activo del usuario',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser verdadero o falso' })
  activo?: boolean;
}
