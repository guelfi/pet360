import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendVaccineCardDto {
  @ApiProperty()
  @IsString()
  tutorPhone: string;

  @ApiProperty()
  @IsString()
  petId: string;
}
