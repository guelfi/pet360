import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DaycareService {
  constructor(private prisma: PrismaService) {}

  async findAllPackages(businessId: string) {
    return this.prisma.daycarePackage.findMany({
      where: { businessId, isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async createPackage(businessId: string, data: any) {
    return this.prisma.daycarePackage.create({ data: { ...data, businessId } });
  }

  async findAllEnrollments(businessId: string, query?: any) {
    const { isActive, petId, page = 1, limit = 20 } = query || {};
    const where: any = { package: { businessId } };
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (petId) where.petId = petId;

    const [enrollments, total] = await Promise.all([
      this.prisma.daycareEnrollment.findMany({
        where,
        include: { package: true, pet: true, tutor: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.daycareEnrollment.count({ where }),
    ]);
    return { data: enrollments, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createEnrollment(businessId: string, data: any) {
    const pkg = await this.prisma.daycarePackage.findFirst({ where: { id: data.packageId, businessId } });
    if (!pkg) throw new NotFoundException('Pacote nao encontrado');
    const [pet, tutor] = await Promise.all([
      this.prisma.pet.findFirst({ where: { id: data.petId, businessId } }),
      this.prisma.tutor.findFirst({ where: { id: data.tutorId, businessId } }),
    ]);
    if (!pet) throw new NotFoundException('Pet nao encontrado');
    if (!tutor) throw new NotFoundException('Tutor nao encontrado');

    return this.prisma.daycareEnrollment.create({
      data: {
        ...data,
        totalCredits: pkg.daysIncluded || 0,
        remainingCredits: pkg.daysIncluded || 0,
        amount: pkg.price,
      },
      include: { package: true, pet: true, tutor: true },
    });
  }

  private async assertOwnsEnrollment(enrollmentId: string, businessId: string) {
    const enrollment = await this.prisma.daycareEnrollment.findFirst({
      where: { id: enrollmentId, package: { businessId } },
    });
    if (!enrollment) throw new NotFoundException('Matricula nao encontrada');
    return enrollment;
  }

  private async assertOwnsAttendance(attendanceId: string, businessId: string) {
    const attendance = await this.prisma.daycareAttendance.findFirst({
      where: { id: attendanceId, enrollment: { package: { businessId } } },
    });
    if (!attendance) throw new NotFoundException('Frequencia nao encontrada');
    return attendance;
  }

  async checkIn(enrollmentId: string, date: Date, businessId: string) {
    await this.assertOwnsEnrollment(enrollmentId, businessId);

    const attendance = await this.prisma.daycareAttendance.upsert({
      where: { enrollmentId_date: { enrollmentId, date } },
      update: { checkInTime: new Date(), status: 'PRESENT' },
      create: { enrollmentId, date, checkInTime: new Date(), status: 'PRESENT' },
    });

    await this.prisma.daycareEnrollment.update({
      where: { id: enrollmentId },
      data: { usedCredits: { increment: 1 }, remainingCredits: { decrement: 1 } },
    });

    return attendance;
  }

  async checkOut(enrollmentId: string, date: Date, businessId: string) {
    await this.assertOwnsEnrollment(enrollmentId, businessId);
    return this.prisma.daycareAttendance.update({
      where: { enrollmentId_date: { enrollmentId, date } },
      data: { checkOutTime: new Date() },
    });
  }

  async updateAttendance(attendanceId: string, businessId: string, data: any) {
    await this.assertOwnsAttendance(attendanceId, businessId);
    return this.prisma.daycareAttendance.update({ where: { id: attendanceId }, data });
  }

  async getTodayAttendance(businessId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prisma.daycareAttendance.findMany({
      where: { date: today, enrollment: { package: { businessId } } },
      include: { enrollment: { include: { pet: true, tutor: true } } },
    });
  }
}
