import { IsString, IsOptional, IsNumber, IsInt, IsDateString, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBoardingDto {
  @ApiProperty()
  @IsString()
  tutorId: string;

  @ApiProperty()
  @IsString()
  petId: string;

  @ApiProperty()
  @IsString()
  roomId: string;

  @ApiProperty()
  @IsDateString()
  checkInDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  checkInTime?: string;

  @ApiProperty()
  @IsDateString()
  checkOutDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  checkOutTime?: string;

  @ApiProperty({ example: 80 })
  @IsNumber()
  @Min(0)
  dailyRate: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  totalDays: number;

  @ApiProperty({ example: 240 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  extraServices?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiProperty({ example: 240 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feedingSchedule?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  foodType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  foodAmount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  medications?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialNeeds?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emergencyPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vetName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vetPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
