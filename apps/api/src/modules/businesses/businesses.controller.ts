import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateBusinessDto } from './dto/update-business.dto';

@ApiTags('businesses')
@Controller('businesses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Get('current')
  @ApiOperation({ summary: 'Obter negocio atual' })
  async getCurrent(@Request() req: any) {
    return this.businessesService.findOne(req.user.businessId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Obter estatisticas do dashboard' })
  async getDashboard(@Request() req: any) {
    return this.businessesService.getDashboardStats(req.user.businessId);
  }

  @Put('current')
  @Roles('PROPRIETARIO', 'ADMINISTRADOR')
  @ApiOperation({ summary: 'Atualizar negocio atual' })
  async updateCurrent(@Request() req: any, @Body() data: UpdateBusinessDto) {
    return this.businessesService.update(req.user.businessId, data);
  }

  @Put('settings')
  @Roles('PROPRIETARIO', 'ADMINISTRADOR')
  @ApiOperation({ summary: 'Atualizar configuracoes' })
  async updateSettings(@Request() req: any, @Body() settings: any) {
    return this.businessesService.updateSettings(req.user.businessId, settings);
  }
}
