import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('HACKTOLIVE API')
    .setDescription('The HACKTOLIVE API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('users')
    .addTag('academy')
    .addTag('student')
    .addTag('admin')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`🌐 Network: http://192.168.0.166:${port}`);
}
bootstrap();
