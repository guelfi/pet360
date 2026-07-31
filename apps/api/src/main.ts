import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Cookies (para o JWT em cookie httpOnly)
  app.use(cookieParser());

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const allowedOrigins = [
    frontendUrl,
    ...(process.env.CORS_ALLOWED_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) ?? []),
  ];

  // CORS
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Mitigacao de CSRF: com o token em cookie httpOnly, requisicoes de
  // mutacao vindas de outro site tambem enviariam o cookie automaticamente.
  // SameSite=Lax ja bloqueia a maioria dos casos; isso complementa checando
  // que o Origin (quando enviado, como sempre acontece em requisicoes de
  // browser) bate com um frontend permitido. Requisicoes sem Origin (curl,
  // server-to-server, webhook da Evolution API) nao sao afetadas - nao sao
  // o vetor que CSRF explora.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    const origin = req.headers.origin;

    if (isMutation && origin && !allowedOrigins.includes(origin)) {
      res.status(403).json({
        statusCode: 403,
        message: 'Origem não permitida',
      });
      return;
    }

    next();
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Pet360 API')
    .setDescription('API para gestao de negocios pet')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticacao')
    .addTag('businesses', 'Gestao de negocios')
    .addTag('tutors', 'Gestao de tutores')
    .addTag('pets', 'Gestao de pets')
    .addTag('appointments', 'Agendamentos')
    .addTag('medical-records', 'Prontuario veterinario')
    .addTag('vaccines', 'Carteira de vacinacao')
    .addTag('adoption', 'Adocao de animais')
    .addTag('boarding', 'Hospedagem/Hotel')
    .addTag('daycare', 'Creche/Daycare')
    .addTag('services', 'Servicos')
    .addTag('products', 'Produtos')
    .addTag('sales', 'Vendas')
    .addTag('finance', 'Financeiro')
    .addTag('whatsapp', 'WhatsApp')
    .addTag('analytics', 'Analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3001;
  await app.listen(port);

  console.log(`Pet360 API running on port ${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
