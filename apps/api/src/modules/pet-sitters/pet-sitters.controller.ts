import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PetSittersService } from './pet-sitters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RegisterPetSitterDto } from './dto/register-pet-sitter.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreatePetSitterReviewDto } from './dto/create-review.dto';
import { UpdatePetSitterDto } from './dto/update-pet-sitter.dto';
import { UpdatePetSitterServiceDto } from './dto/update-service.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@ApiTags('pet-sitters')
@Controller('pet-sitters')
export class PetSittersController {
  constructor(private petSittersService: PetSittersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar como cuidador de pets' })
  async register(@Body() dto: RegisterPetSitterDto) {
    return this.petSittersService.register(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cuidadores disponiveis' })
  async findAll(
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('species') species?: string,
    @Query('size') size?: string,
    @Query('serviceType') serviceType?: string,
    @Query('minRating') minRating?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.petSittersService.findAll({ city, state, species, size, serviceType, minRating, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes do cuidador' })
  async findOne(@Param('id') id: string) {
    return this.petSittersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar perfil do cuidador' })
  async update(@Param('id') id: string, @Body() dto: UpdatePetSitterDto, @Request() req: any) {
    return this.petSittersService.update(id, dto, req.user.email);
  }

  // Services
  @Post(':id/services')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar servico' })
  async addService(@Param('id') id: string, @Body() dto: CreateServiceDto, @Request() req: any) {
    return this.petSittersService.addService(id, dto, req.user.email);
  }

  @Put('services/:serviceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar servico' })
  async updateService(@Param('serviceId') serviceId: string, @Body() dto: UpdatePetSitterServiceDto, @Request() req: any) {
    return this.petSittersService.updateService(serviceId, dto, req.user.email);
  }

  @Delete('services/:serviceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover servico' })
  async deleteService(@Param('serviceId') serviceId: string, @Request() req: any) {
    return this.petSittersService.deleteService(serviceId, req.user.email);
  }

  // Bookings
  @Post('bookings')
  @ApiOperation({ summary: 'Criar reserva com cuidador' })
  async createBooking(@Body() dto: CreateBookingDto) {
    return this.petSittersService.createBooking(dto);
  }

  @Get(':id/bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar reservas do cuidador' })
  async getBookings(@Param('id') id: string, @Request() req: any, @Query('status') status?: string) {
    return this.petSittersService.getBookings(id, status, req.user.email);
  }

  @Put('bookings/:bookingId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar status da reserva' })
  async updateBookingStatus(
    @Param('bookingId') bookingId: string,
    @Body() data: UpdateBookingStatusDto,
    @Request() req: any,
  ) {
    return this.petSittersService.updateBookingStatus(bookingId, data.status, data.reason, req.user.email);
  }

  // Reviews
  @Post('bookings/:bookingId/review')
  @ApiOperation({ summary: 'Avaliar cuidador' })
  async createReview(@Param('bookingId') bookingId: string, @Body() dto: CreatePetSitterReviewDto) {
    return this.petSittersService.createReview(bookingId, dto);
  }

  // Admin endpoints
  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPRIETARIO', 'ADMINISTRADOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar cuidadores pendentes de aprovacao' })
  async getPendingApprovals() {
    return this.petSittersService.getPendingApprovals();
  }

  @Put('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROPRIETARIO', 'ADMINISTRADOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprovar/Rejeitar cuidador' })
  async updateStatus(@Param('id') id: string, @Body() data: UpdateBookingStatusDto) {
    return this.petSittersService.updateStatus(id, data.status, data.reason);
  }
}
