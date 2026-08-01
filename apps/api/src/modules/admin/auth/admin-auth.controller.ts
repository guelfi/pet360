import { Controller, Post, Get, Body, UseGuards, Request, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth.guard';

const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias
const ACCESS_COOKIE_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutos

function cookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax' as const,
    maxAge: maxAgeMs,
    path: '/',
  };
}

function setAdminAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('admin_access_token', accessToken, cookieOptions(ACCESS_COOKIE_MAX_AGE_MS));
  res.cookie('admin_refresh_token', refreshToken, cookieOptions(REFRESH_COOKIE_MAX_AGE_MS));
}

function clearAdminAuthCookies(res: Response) {
  res.clearCookie('admin_access_token', { path: '/' });
  res.clearCookie('admin_refresh_token', { path: '/' });
}

@ApiTags('admin-auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login do administrador da plataforma' })
  async login(@Body() dto: AdminLoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.adminAuthService.login(dto);
    setAdminAuthCookies(res, result.access_token, result.refresh_token);
    return { admin: result.admin };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar access token do administrador' })
  async refresh(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.admin_refresh_token;
    const result = await this.adminAuthService.refreshToken(token);
    setAdminAuthCookies(res, result.access_token, result.refresh_token);
    return { message: 'Token renovado' };
  }

  @Post('logout')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout do administrador' })
  async logout(@Res({ passthrough: true }) res: Response) {
    clearAdminAuthCookies(res);
    return { message: 'Logout realizado com sucesso' };
  }

  @Get('me')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do administrador logado' })
  async getProfile(@Request() req: any) {
    return this.adminAuthService.getProfile(req.user.sub);
  }
}
