import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePetDto } from '../../pets/dto/create-pet.dto';

export class CreateAnimalDto {
  @ApiProperty({ type: CreatePetDto })
  @ValidateNested()
  @Type(() => CreatePetDto)
  petData: CreatePetDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  rescueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rescueLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rescueStory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  previousOwner?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVaccinated?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isNeutered?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDewormed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  healthNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  goodWithKids?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  goodWithDogs?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  goodWithCats?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  apartmentFriendly?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  energyLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trainingLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  adoptionFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  publishedOnSite?: boolean;
}
