import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AssignRoleDto {
  @ApiProperty({
    description: 'ID del usuario al que se asignará el rol',
    example: 1
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idUsuario: number;

  @ApiProperty({
    description: 'ID del rol a asignar',
    example: 2
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idRol: number;
}