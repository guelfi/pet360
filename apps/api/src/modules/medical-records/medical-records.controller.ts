import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@ApiTags('medical-records')
@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'ADMIN', 'VET')
@ApiBearerAuth()
export class MedicalRecordsController {
  constructor(private medicalRecordsService: MedicalRecordsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar prontuarios' })
  async findAll(@Request() req: any, @Query() query: any) {
    return this.medicalRecordsService.findAll(req.user.businessId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar prontuario por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.medicalRecordsService.findOne(id, req.user.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar prontuario' })
  async create(@Body() data: CreateMedicalRecordDto, @Request() req: any) {
    return this.medicalRecordsService.create(req.user.businessId, req.user.sub, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar prontuario' })
  async update(@Param('id') id: string, @Body() data: UpdateMedicalRecordDto, @Request() req: any) {
    return this.medicalRecordsService.update(id, req.user.businessId, data);
  }
}
