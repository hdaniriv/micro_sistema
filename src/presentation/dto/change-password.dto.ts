import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual',
    example: 'passwordActual123',
  })
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'nuevaPassword123',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
