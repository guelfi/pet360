import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendTextDto {
  @ApiProperty()
  @IsString()
  instanceName: string;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsString()
  text: string;
}
