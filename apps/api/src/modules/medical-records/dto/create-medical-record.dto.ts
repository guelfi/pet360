import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsArray,
  IsBoolean,
  IsDateString,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePrescriptionDto } from './create-prescription.dto';

export class CreateMedicalRecordDto {
  @ApiProperty()
  @IsString()
  petId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appointmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  recordDate?: string;

  @ApiProperty({ example: 'CONSULTATION' })
  @IsString()
  recordType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  heartRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  respiratoryRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hydration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  bodyCondition?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  historyPresent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  physicalExam?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  differentialDiagnosis?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  prescription?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  examsRequested?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  procedures?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prognosis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  attachments?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isHospitalized?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  admissionDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dischargeDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hospitalizationNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isSurgical?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  surgeryType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  anesthesiaType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  surgeryNotes?: string;

  @ApiPropertyOptional({ type: [CreatePrescriptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionDto)
  prescriptions?: CreatePrescriptionDto[];
}
