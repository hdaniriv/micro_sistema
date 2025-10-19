import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Nueva contraseña a establecer' })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @MinLength(6, {
    message: 'La nueva contraseña debe tener al menos 6 caracteres',
  })
  newPassword!: string;
}
