import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminBusinessesService } from './admin-businesses.service';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';

@ApiTags('admin-businesses')
@Controller('admin/businesses')
@UseGuards(AdminJwtAuthGuard)
@ApiBearerAuth()
export class AdminBusinessesController {
  constructor(private adminBusinessesService: AdminBusinessesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os negocios (tenants) da plataforma' })
  async findAll() {
    return this.adminBusinessesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de um negocio (tenant) especifico' })
  async findOne(@Param('id') id: string) {
    return this.adminBusinessesService.findOne(id);
  }
}
