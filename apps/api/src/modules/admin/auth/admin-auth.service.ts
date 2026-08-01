import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PlatformAdminService } from '../platform-admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private platformAdminService: PlatformAdminService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: AdminLoginDto) {
    const admin = await this.platformAdminService.findByEmail(dto.email);
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    await this.platformAdminService.updateLastLogin(admin.id);

    const payload = { sub: admin.id, email: admin.email, type: 'platform_admin' as const };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('PLATFORM_ADMIN_JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
      admin: { id: admin.id, name: admin.name, email: admin.email },
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('PLATFORM_ADMIN_JWT_REFRESH_SECRET'),
      });
      if (payload.type !== 'platform_admin') {
        throw new UnauthorizedException('Token invalido');
      }

      const admin = await this.platformAdminService.findById(payload.sub);
      if (!admin || !admin.isActive) {
        throw new UnauthorizedException('Administrador nao encontrado ou inativo');
      }

      const newPayload = { sub: admin.id, email: admin.email, type: 'platform_admin' as const };

      return {
        access_token: this.jwtService.sign(newPayload),
        refresh_token: this.jwtService.sign(newPayload, {
          secret: this.configService.get<string>('PLATFORM_ADMIN_JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        }),
      };
    } catch {
      throw new UnauthorizedException('Token invalido ou expirado');
    }
  }

  async getProfile(adminId: string) {
    const admin = await this.platformAdminService.findById(adminId);
    if (!admin) {
      throw new UnauthorizedException('Administrador nao encontrado');
    }
    const { passwordHash: _, ...safe } = admin;
    return safe;
  }
}
