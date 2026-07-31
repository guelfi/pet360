import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DaycareService } from './daycare.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePackageDto } from './dto/create-package.dto';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@ApiTags('daycare')
@Controller('daycare')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DaycareController {
  constructor(private daycareService: DaycareService) {}

  @Get('packages')
  @ApiOperation({ summary: 'Listar pacotes' })
  async findAllPackages(@Request() req: any) {
    return this.daycareService.findAllPackages(req.user.businessId);
  }

  @Post('packages')
  @ApiOperation({ summary: 'Criar pacote' })
  async createPackage(@Body() data: CreatePackageDto, @Request() req: any) {
    return this.daycareService.createPackage(req.user.businessId, data);
  }

  @Get('enrollments')
  @ApiOperation({ summary: 'Listar matriculas' })
  async findAllEnrollments(@Request() req: any, @Query() query: any) {
    return this.daycareService.findAllEnrollments(req.user.businessId, query);
  }

  @Post('enrollments')
  @ApiOperation({ summary: 'Criar matricula' })
  async createEnrollment(@Body() data: CreateEnrollmentDto, @Request() req: any) {
    return this.daycareService.createEnrollment(req.user.businessId, data);
  }

  @Get('attendance')
  @ApiOperation({ summary: 'Frequencia do dia' })
  async getTodayAttendance(@Request() req: any) {
    return this.daycareService.getTodayAttendance(req.user.businessId);
  }

  @Post('attendance/:enrollmentId/checkin')
  @ApiOperation({ summary: 'Check-in' })
  async checkIn(@Param('enrollmentId') enrollmentId: string, @Request() req: any) {
    return this.daycareService.checkIn(enrollmentId, new Date(), req.user.businessId);
  }

  @Post('attendance/:enrollmentId/checkout')
  @ApiOperation({ summary: 'Check-out' })
  async checkOut(@Param('enrollmentId') enrollmentId: string, @Request() req: any) {
    return this.daycareService.checkOut(enrollmentId, new Date(), req.user.businessId);
  }

  @Put('attendance/:id')
  @ApiOperation({ summary: 'Atualizar frequencia' })
  async updateAttendance(@Param('id') id: string, @Body() data: UpdateAttendanceDto, @Request() req: any) {
    return this.daycareService.updateAttendance(id, req.user.businessId, data);
  }
}
