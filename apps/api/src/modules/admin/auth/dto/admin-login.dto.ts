import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@plataforma.pet360.com.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha-forte' })
  @IsString()
  @MinLength(6)
  password: string;
}
