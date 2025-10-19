import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual',
    example: 'passwordActual123',
  })
  @IsString({ message: 'La contraseña actual debe ser una cadena de texto' })
  @MinLength(6, {
    message: 'La contraseña actual debe tener al menos 6 caracteres',
  })
  currentPassword: string;

  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'nuevaPassword123',
  })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @MinLength(6, {
    message: 'La nueva contraseña debe tener al menos 6 caracteres',
  })
  newPassword: string;
}
