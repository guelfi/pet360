import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlatformAdminService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.platformAdmin.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.platformAdmin.findUnique({ where: { id } });
  }

  async updateLastLogin(id: string) {
    return this.prisma.platformAdmin.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
