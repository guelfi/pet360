import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlatformAdminService } from './platform-admin.service';
import { AdminAuthService } from './auth/admin-auth.service';
import { AdminAuthController } from './auth/admin-auth.controller';
import { AdminJwtStrategy } from './auth/strategies/admin-jwt.strategy';
import { AdminBusinessesService } from './businesses/admin-businesses.service';
import { AdminBusinessesController } from './businesses/admin-businesses.controller';

// Modulo isolado do modulo `auth` de tenant: secret, cookies, guard e
// strategy proprios (`jwt-platform-admin`), para que um token de tenant
// jamais seja aceito aqui e vice-versa.
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('PLATFORM_ADMIN_JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminAuthController, AdminBusinessesController],
  providers: [PlatformAdminService, AdminAuthService, AdminJwtStrategy, AdminBusinessesService],
})
export class AdminModule {}
