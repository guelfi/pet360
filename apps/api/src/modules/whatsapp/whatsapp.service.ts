import { Injectable, ForbiddenException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsAppService {
  private evolutionApiUrl: string;
  private evolutionApiKey: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.evolutionApiUrl = this.configService.get<string>('EVOLUTION_API_URL') || 'http://localhost:8080';
    this.evolutionApiKey = this.configService.get<string>('EVOLUTION_API_KEY') || '';
  }

  /**
   * instanceName vinha da query/body sem checar contra o negocio de quem
   * chama - qualquer usuario autenticado (de qualquer negocio) conseguia
   * ler o QR code/status ou mandar mensagem pela instancia de WhatsApp de
   * outro negocio, so sabendo o nome da instancia.
   */
  private async assertOwnsInstance(businessId: string, instanceName: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business?.whatsappInstanceId || business.whatsappInstanceId !== instanceName) {
      throw new ForbiddenException('Instância de WhatsApp não pertence a este negócio');
    }
  }

  private async evolutionRequest(endpoint: string, method: string = 'GET', body?: any) {
    const response = await fetch(`${this.evolutionApiUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.evolutionApiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json();
  }

  async createInstance(businessId: string, instanceName: string) {
    const result = await this.evolutionRequest('/instance/create', 'POST', {
      instanceName,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
    });

    await this.prisma.business.update({
      where: { id: businessId },
      data: { whatsappInstanceId: instanceName },
    });

    return result;
  }

  async getQrCode(businessId: string, instanceName: string) {
    await this.assertOwnsInstance(businessId, instanceName);
    return this.evolutionRequest(`/instance/connect/${instanceName}`);
  }

  async getStatus(businessId: string, instanceName: string) {
    await this.assertOwnsInstance(businessId, instanceName);
    return this.evolutionRequest(`/instance/connectionState/${instanceName}`);
  }

  async sendText(businessId: string, instanceName: string, number: string, text: string) {
    await this.assertOwnsInstance(businessId, instanceName);
    return this.evolutionRequest(`/message/sendText/${instanceName}`, 'POST', {
      number,
      text,
    });
  }

  async sendImage(instanceName: string, number: string, imageUrl: string, caption?: string) {
    return this.evolutionRequest(`/message/sendMedia/${instanceName}`, 'POST', {
      number,
      mediatype: 'image',
      media: imageUrl,
      caption,
    });
  }

  async sendVaccineCard(businessId: string, tutorPhone: string, petId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business?.whatsappInstanceId) throw new BadRequestException('WhatsApp nao configurado');

    const pet = await this.prisma.pet.findFirst({
      where: { id: petId, businessId },
      include: {
        tutor: true,
        vaccineRecords: {
          orderBy: { applicationDate: 'desc' },
          include: { vet: { select: { name: true, crmv: true } } },
        },
      },
    });

    if (!pet) throw new NotFoundException('Pet nao encontrado');

    const vaccineList = pet.vaccineRecords
      .map((v) => `- ${v.vaccineName}: ${new Date(v.applicationDate).toLocaleDateString('pt-BR')}`)
      .join('\n');

    const message = `*Carteira de Vacinacao - ${pet.name}*\n\n${vaccineList}\n\n_${business.name}_`;

    return this.sendText(businessId, business.whatsappInstanceId, tutorPhone, message);
  }

  /**
   * businessId vem da query string sem nenhuma verificacao de que a
   * requisicao realmente veio da Evolution API - qualquer um podia forjar
   * um webhook e injetar mensagens falsas pra qualquer negocio. Exige o
   * mesmo apikey configurado pra chamar a Evolution API (enviado de volta
   * no header 'apikey', igual as chamadas que fazemos pra ela).
   */
  async handleWebhook(businessId: string, data: any, providedApiKey?: string) {
    if (!this.evolutionApiKey || providedApiKey !== this.evolutionApiKey) {
      throw new UnauthorizedException('Assinatura de webhook inválida');
    }

    if (data.event === 'messages.upsert') {
      const message = data.data;
      await this.prisma.whatsAppMessage.create({
        data: {
          businessId,
          remoteJid: message.key.remoteJid,
          messageId: message.key.id,
          direction: message.key.fromMe ? 'OUTBOUND' : 'INBOUND',
          content: message.message?.conversation || message.message?.extendedTextMessage?.text || '',
          mediaUrl: message.message?.imageMessage?.url || null,
          mediaType: message.message?.imageMessage ? 'image' : null,
          status: 'RECEIVED',
        },
      });
    }
    return { success: true };
  }

  async getTemplates(businessId: string) {
    return this.prisma.messageTemplate.findMany({ where: { businessId } });
  }

  async createTemplate(businessId: string, data: any) {
    return this.prisma.messageTemplate.create({ data: { ...data, businessId } });
  }
}
