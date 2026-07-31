import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAttendanceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  checkOutTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  behaviorNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  activities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feedingNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  photos?: string[];
}
