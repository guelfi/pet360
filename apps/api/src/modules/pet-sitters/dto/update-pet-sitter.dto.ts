import { PartialType } from '@nestjs/swagger';
import { RegisterPetSitterDto } from './register-pet-sitter.dto';

export class UpdatePetSitterDto extends PartialType(RegisterPetSitterDto) {}
