import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

// Nota: a matriz de RBAC aprovada previa GROOMER/TRAINER restritos aos
// "servicos que prestam", mas o schema atual de Service nao tem nenhum
// vinculo com profissional (diferente do Appointment, que tem
// professionalId) - nao existe "servicos que um groomer presta" pra
// filtrar. Fica documentado aqui como limitacao conhecida; o catalogo de
// servicos por enquanto e so leitura geral + escrita OWNER/ADMIN.
@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar servicos' })
  async findAll(@Request() req: any, @Query() query: any) {
    return this.servicesService.findAll(req.user.businessId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar servico por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.servicesService.findOne(id, req.user.businessId);
  }

  @Post()
  @Roles('PROPRIETARIO', 'ADMINISTRADOR')
  @ApiOperation({ summary: 'Criar servico' })
  async create(@Body() data: CreateServiceDto, @Request() req: any) {
    return this.servicesService.create(req.user.businessId, data);
  }

  @Put(':id')
  @Roles('PROPRIETARIO', 'ADMINISTRADOR')
  @ApiOperation({ summary: 'Atualizar servico' })
  async update(@Param('id') id: string, @Body() data: UpdateServiceDto, @Request() req: any) {
    return this.servicesService.update(id, req.user.businessId, data);
  }

  @Delete(':id')
  @Roles('PROPRIETARIO', 'ADMINISTRADOR')
  @ApiOperation({ summary: 'Remover servico' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.servicesService.delete(id, req.user.businessId);
  }
}
