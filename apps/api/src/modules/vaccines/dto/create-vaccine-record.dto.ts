import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VaccineType } from '@prisma/client';

export class CreateVaccineRecordDto {
  @ApiProperty()
  @IsString()
  petId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appointmentId?: string;

  @ApiProperty({ enum: VaccineType, example: 'V10' })
  @IsEnum(VaccineType)
  vaccineType: VaccineType;

  @ApiProperty({ example: 'V10 - Multipla' })
  @IsString()
  vaccineName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiProperty()
  @IsDateString()
  applicationDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  nextDoseDate?: string;

  @ApiPropertyOptional({ enum: VaccineType })
  @IsOptional()
  @IsEnum(VaccineType)
  nextDoseType?: VaccineType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hadReaction?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reactionNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificateUrl?: string;
}
