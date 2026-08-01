import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminBusinessesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.business.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        phone: true,
        businessTypes: true,
        createdAt: true,
        _count: { select: { users: true, appointments: true, tutors: true, pets: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        phone: true,
        businessTypes: true,
        address: true,
        city: true,
        state: true,
        createdAt: true,
        users: { select: { id: true, name: true, email: true, role: true, isActive: true } },
        _count: { select: { users: true, appointments: true, tutors: true, pets: true, sales: true } },
      },
    });
    if (!business) throw new NotFoundException('Negocio nao encontrado');
    return business;
  }
}
