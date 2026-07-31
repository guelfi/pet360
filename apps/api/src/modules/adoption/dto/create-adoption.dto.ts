import { IsString, IsOptional, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdoptionDto {
  @ApiProperty()
  @IsString()
  adoptionAnimalId: string;

  @ApiProperty()
  @IsString()
  tutorId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  interviewDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  homeVisitDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  questionnaire?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stageNotes?: string;
}
