import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

// VET, GROOMER e TRAINER so enxergam/agem sobre a propria agenda (matriz
// de RBAC aprovada); OWNER, ADMIN e ATTENDANT tem acesso a agenda geral.
const OWN_AGENDA_ONLY_ROLES = ['VET', 'GROOMER', 'TRAINER'];

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos' })
  async findAll(@Request() req: any, @Query() query: any) {
    if (OWN_AGENDA_ONLY_ROLES.includes(req.user.role)) {
      query = { ...query, professionalId: req.user.sub };
    }
    return this.appointmentsService.findAll(req.user.businessId, query);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Calendario de agendamentos' })
  async getCalendar(@Request() req: any, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.appointmentsService.getCalendar(req.user.businessId, startDate, endDate);
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Horarios disponiveis' })
  async getAvailableSlots(
    @Request() req: any,
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
    @Query('professionalId') professionalId?: string,
  ) {
    return this.appointmentsService.getAvailableSlots(req.user.businessId, date, serviceId, professionalId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const appointment = await this.appointmentsService.findOne(id, req.user.businessId);
    this.assertOwnAgenda(req, appointment.professionalId);
    return appointment;
  }

  @Post()
  @ApiOperation({ summary: 'Criar agendamento' })
  async create(@Body() data: CreateAppointmentDto, @Request() req: any) {
    return this.appointmentsService.create(req.user.businessId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar agendamento' })
  async update(@Param('id') id: string, @Body() data: UpdateAppointmentDto, @Request() req: any) {
    await this.assertOwnAgendaById(req, id);
    return this.appointmentsService.update(id, req.user.businessId, data);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Atualizar status do agendamento' })
  async updateStatus(
    @Param('id') id: string,
    @Body() data: UpdateAppointmentStatusDto,
    @Request() req: any,
  ) {
    await this.assertOwnAgendaById(req, id);
    return this.appointmentsService.updateStatus(id, req.user.businessId, data.status);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirmar agendamento' })
  async confirm(@Param('id') id: string, @Request() req: any) {
    await this.assertOwnAgendaById(req, id);
    return this.appointmentsService.updateStatus(id, req.user.businessId, 'CONFIRMED');
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Iniciar atendimento' })
  async start(@Param('id') id: string, @Request() req: any) {
    await this.assertOwnAgendaById(req, id);
    return this.appointmentsService.updateStatus(id, req.user.businessId, 'IN_PROGRESS');
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Finalizar atendimento' })
  async complete(@Param('id') id: string, @Request() req: any) {
    await this.assertOwnAgendaById(req, id);
    return this.appointmentsService.updateStatus(id, req.user.businessId, 'COMPLETED');
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelar agendamento' })
  async cancel(@Param('id') id: string, @Request() req: any) {
    await this.assertOwnAgendaById(req, id);
    return this.appointmentsService.updateStatus(id, req.user.businessId, 'CANCELLED');
  }

  /**
   * VET/GROOMER/TRAINER so podem ver/agir sobre a propria agenda - trata
   * como "nao encontrado" (mesmo padrao de IDOR entre negocios) em vez de
   * 403, pra nao revelar que o agendamento existe na agenda de outro
   * profissional.
   */
  private assertOwnAgenda(req: any, professionalId: string): void {
    if (OWN_AGENDA_ONLY_ROLES.includes(req.user.role) && professionalId !== req.user.sub) {
      throw new NotFoundException('Agendamento nao encontrado');
    }
  }

  private async assertOwnAgendaById(req: any, id: string): Promise<void> {
    if (!OWN_AGENDA_ONLY_ROLES.includes(req.user.role)) return;
    const appointment = await this.appointmentsService.findOne(id, req.user.businessId);
    this.assertOwnAgenda(req, appointment.professionalId);
  }
}
