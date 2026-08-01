import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

// Cookie httpOnly dedicado ao admin de plataforma - nome diferente do
// cookie de tenant (access_token) para nunca colidir/ser confundido com
// ele, mesmo no mesmo navegador.
function cookieOrHeaderExtractor(req: Request): string | null {
  const cookieToken = req?.cookies?.admin_access_token;
  if (cookieToken) return cookieToken;
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'jwt-platform-admin') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieOrHeaderExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('PLATFORM_ADMIN_JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (payload.type !== 'platform_admin') {
      throw new UnauthorizedException('Token invalido');
    }
    return { sub: payload.sub, email: payload.email };
  }
}
