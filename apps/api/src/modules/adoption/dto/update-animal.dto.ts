import { OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdoptionStatus } from '@prisma/client';
import { CreateAnimalDto } from './create-animal.dto';

export class UpdateAnimalDto extends PartialType(OmitType(CreateAnimalDto, ['petData'] as const)) {
  @ApiPropertyOptional({ enum: AdoptionStatus })
  @IsOptional()
  @IsEnum(AdoptionStatus)
  status?: AdoptionStatus;
}
