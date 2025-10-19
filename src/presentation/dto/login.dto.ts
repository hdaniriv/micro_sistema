import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Nombre de usuario o email',
    example: 'usuario123',
  })
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @MinLength(3, { message: 'El usuario debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El usuario no puede superar 100 caracteres' })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'miPassword123',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede superar 100 caracteres' })
  password: string;
}
