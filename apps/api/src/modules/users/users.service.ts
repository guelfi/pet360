import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, businessId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, businessId },
      include: { business: true },
    });
    if (!user) throw new NotFoundException('Usuario nao encontrado');
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  /**
   * Auto-consulta a partir de um ID ja verificado por JWT (payload.sub), nao
   * de um parametro de URL/body vindo de outro usuario - sem risco de IDOR
   * porque quem pode chamar isso e apenas o dono do proprio token.
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { business: true },
    });
    if (!user) return null;
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
      include: { business: true },
    });
  }

  async findByBusinessId(businessId: string) {
    return this.prisma.user.findMany({
      where: { businessId },
      orderBy: { name: 'asc' },
    });
  }

  async createWithBusiness(dto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.findByEmail(dto.userEmail);
    if (existingUser) {
      throw new ConflictException('Email ja cadastrado');
    }

    // Create slug from business name
    const slug = dto.businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existingBusiness = await this.prisma.business.findUnique({
      where: { slug },
    });

    const finalSlug = existingBusiness
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create business and user in transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      const business = await prisma.business.create({
        data: {
          name: dto.businessName,
          slug: finalSlug,
          cnpj: dto.cnpj,
          phone: dto.businessPhone,
          email: dto.businessEmail,
          businessTypes: dto.businessTypes,
        },
      });

      const user = await prisma.user.create({
        data: {
          businessId: business.id,
          name: dto.userName,
          email: dto.userEmail,
          phone: dto.userPhone,
          role: 'PROPRIETARIO',
          passwordHash,
        },
      });

      return { business, user };
    });

    const { passwordHash: _, ...userWithoutPassword } = result.user;
    return {
      business: result.business,
      user: userWithoutPassword,
    };
  }

  async update(id: string, businessId: string, data: any) {
    const user = await this.prisma.user.findFirst({ where: { id, businessId } });
    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    // Bloqueia escalacao de privilegio / troca de tenant via mass-assignment.
    // TODO(RBAC): quando houver checagem de papel, permitir OWNER/ADMIN trocar
    // role de outros usuarios do mesmo negocio via fluxo dedicado, nao aqui.
    delete data.role;
    delete data.businessId;
    delete data.passwordHash;
    delete data.id;
    delete data.otpCode;
    delete data.otpExpiresAt;

    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { passwordHash: _, ...safe } = updated;
    return safe;
  }

  async delete(id: string, businessId: string) {
    const user = await this.prisma.user.findFirst({ where: { id, businessId } });
    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
