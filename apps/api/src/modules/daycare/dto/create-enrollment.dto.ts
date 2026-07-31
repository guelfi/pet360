import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsString()
  packageId: string;

  @ApiProperty()
  @IsString()
  petId: string;

  @ApiProperty()
  @IsString()
  tutorId: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;
}
