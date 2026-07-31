import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsAppService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('whatsapp')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private whatsAppService: WhatsAppService) {}

  @Post('system/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configurar instancia WhatsApp' })
  async setup(@Request() req: any, @Body('instanceName') instanceName: string) {
    return this.whatsAppService.createInstance(req.user.businessId, instanceName);
  }

  @Get('system/qrcode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter QR Code' })
  async getQrCode(@Request() req: any, @Query('instanceName') instanceName: string) {
    return this.whatsAppService.getQrCode(req.user.businessId, instanceName);
  }

  @Get('system/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Status da conexao' })
  async getStatus(@Request() req: any, @Query('instanceName') instanceName: string) {
    return this.whatsAppService.getStatus(req.user.businessId, instanceName);
  }

  @Post('send/text')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar texto' })
  async sendText(@Request() req: any, @Body() data: { instanceName: string; number: string; text: string }) {
    return this.whatsAppService.sendText(req.user.businessId, data.instanceName, data.number, data.text);
  }

  @Post('send/vaccine-card')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar carteira de vacinas' })
  async sendVaccineCard(@Request() req: any, @Body() data: { tutorPhone: string; petId: string }) {
    return this.whatsAppService.sendVaccineCard(req.user.businessId, data.tutorPhone, data.petId);
  }

  @Post('webhooks')
  @ApiOperation({ summary: 'Webhook para receber mensagens' })
  async handleWebhook(
    @Query('businessId') businessId: string,
    @Body() data: any,
    @Headers('apikey') apiKey?: string,
  ) {
    return this.whatsAppService.handleWebhook(businessId, data, apiKey);
  }

  @Get('templates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar templates' })
  async getTemplates(@Request() req: any) {
    return this.whatsAppService.getTemplates(req.user.businessId);
  }

  @Post('templates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar template' })
  async createTemplate(@Request() req: any, @Body() data: any) {
    return this.whatsAppService.createTemplate(req.user.businessId, data);
  }
}
