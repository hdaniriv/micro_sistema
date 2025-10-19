import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({
    description: 'ID del usuario al que se asignará el rol',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'El ID de usuario debe ser un número entero' })
  @IsPositive({ message: 'El ID de usuario debe ser un número positivo' })
  idUsuario: number;

  @ApiProperty({
    description: 'ID del rol a asignar',
    example: 2,
  })
  @Type(() => Number)
  @IsInt({ message: 'El ID de rol debe ser un número entero' })
  @IsPositive({ message: 'El ID de rol debe ser un número positivo' })
  idRol: number;
}
