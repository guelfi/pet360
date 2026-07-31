import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdoptionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stageNotes?: string;

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
  @IsDateString()
  adoptionDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  agreementUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  signedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  followUp7d?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  followUp7dNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  followUp30d?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  followUp30dNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  followUp90d?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  followUp90dNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  returnReason?: string;
}
