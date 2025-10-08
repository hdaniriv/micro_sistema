import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Nombre de usuario o email',
    example: 'usuario123',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'miPassword123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
