import { Controller, Post, Body, Get, UseGuards, Request, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias
const ACCESS_COOKIE_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutos (bate com JWT_EXPIRATION default)

// Flag "Secure" desligada por padrao: o deploy atual na OCI serve tudo em
// HTTP puro (IP direto, sem TLS), e um cookie Secure sobre HTTP nunca e
// enviado de volta pelo navegador, quebrando o login inteiro em producao.
// Ligar via env COOKIE_SECURE=true quando o dominio tiver HTTPS.
function cookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax' as const,
    maxAge: maxAgeMs,
    path: '/',
  };
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('access_token', accessToken, cookieOptions(ACCESS_COOKIE_MAX_AGE_MS));
  res.cookie('refresh_token', refreshToken, cookieOptions(REFRESH_COOKIE_MAX_AGE_MS));
}

function clearAuthCookies(res: Response) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login com email e senha' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    setAuthCookies(res, result.access_token, result.refresh_token);
    return { user: result.user };
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo negocio e usuario' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar access token' })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refresh_token || refreshTokenDto.refresh_token;
    const result = await this.authService.refreshToken(token);
    setAuthCookies(res, result.access_token, result.refresh_token);
    return { message: 'Token renovado' };
  }

  @Post('otp/request')
  @ApiOperation({ summary: 'Solicitar codigo OTP via WhatsApp' })
  async requestOtp(@Body() body: { phone: string }) {
    return this.authService.requestOtp(body.phone);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verificar codigo OTP e fazer login' })
  async verifyOtp(
    @Body() body: { phone: string; otp: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyOtp(body.phone, body.otp);
    setAuthCookies(res, result.access_token, result.refresh_token);
    return { user: result.user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout - limpa os cookies de sessao' })
  async logout(@Res({ passthrough: true }) res: Response) {
    clearAuthCookies(res);
    return { message: 'Logout realizado com sucesso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuario logado' })
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.sub);
  }
}
