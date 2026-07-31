import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

// Cookie httpOnly (usada pelo frontend web) como fonte primaria, com
// fallback para o header Authorization: Bearer (scripts, testes,
// chamadas server-to-server).
function cookieOrHeaderExtractor(req: Request): string | null {
  const cookieToken = req?.cookies?.access_token;
  if (cookieToken) return cookieToken;
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieOrHeaderExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      email: payload.email,
      businessId: payload.businessId,
      role: payload.role,
    };
  }
}
