import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: isProduction 
      ? ['error', 'warn'] // Only log errors and warnings in production
      : ['log', 'error', 'warn', 'debug', 'verbose'], // All logs in development
  });

  // Serve static files from uploads directory
  // In development: uploads folder is at project root
  // In production (dist): uploads folder is at project root too
  const uploadsPath = join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Enable CORS for frontend - support multiple origins
  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:3000', 'http://192.168.0.166:3000'];
  
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger configuration - Only in development
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('HACKTOLIVE API')
      .setDescription('The HACKTOLIVE API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth')
      .addTag('users')
      .addTag('upload')
      .addTag('academy')
      .addTag('student')
      .addTag('admin')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');
  
  if (isProduction) {
    console.log(`🚀 Application is running on port: ${port}`);
  } else {
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`🌐 Network: http://192.168.0.166:${port}`);
  }
}
bootstrap();
