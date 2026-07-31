import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectListingDto {
  @ApiProperty()
  @IsString()
  reason: string;
}
