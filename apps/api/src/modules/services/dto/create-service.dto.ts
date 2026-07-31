import { IsString, IsOptional, IsNumber, IsInt, IsArray, IsBoolean, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Species, PetSize } from '@prisma/client';

export class CreateServiceDto {
  @ApiProperty({ example: 'Banho e Tosa' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'GROOMING' })
  @IsString()
  category: string;

  @ApiProperty({ example: 60 })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 80 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  priceBySize?: Record<string, number>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  acceptedSpecies?: Species[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  acceptedSizes?: PetSize[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requiresVet?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
