import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'usuario123',
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value
  )
  @MinLength(3, { message: 'El usuario debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El usuario no puede superar 50 caracteres' })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'miPassword123',
    minLength: 6,
    maxLength: 100,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede superar 100 caracteres' })
  password: string;

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
}
