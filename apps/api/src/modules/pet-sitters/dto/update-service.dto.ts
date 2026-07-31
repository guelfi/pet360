import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';

export class UpdatePetSitterServiceDto extends PartialType(CreateServiceDto) {}
