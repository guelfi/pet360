import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentStatusDto {
  @ApiProperty({ enum: AppointmentStatus, example: 'CONFIRMED' })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
