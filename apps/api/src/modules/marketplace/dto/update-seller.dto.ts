import { PartialType } from '@nestjs/swagger';
import { RegisterSellerDto } from './register-seller.dto';

export class UpdateSellerDto extends PartialType(RegisterSellerDto) {}
