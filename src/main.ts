import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/exceptions/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Configurar filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configurar CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN')?.split(',') || [
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configurar prefijo global para las rutas
  app.setGlobalPrefix('api');

  // Configurar Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(
      configService.get<string>('SWAGGER_TITLE') ||
        'Microservicio Principal API'
    )
    .setDescription(
      configService.get<string>('SWAGGER_DESCRIPTION') ||
        'API para gestión de usuarios, autenticación y coordinación del sistema'
    )
    .setVersion(configService.get<string>('SWAGGER_VERSION') || '1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = configService.get<string>('SWAGGER_PATH') || 'api/docs';
  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('PORT') || 3000;

  console.log(`\n=== Sistema de Gestión Iniciado ===`);
  console.log(`Puerto: ${port}`);
  console.log(`Entorno: ${configService.get<string>('NODE_ENV')}`);
  console.log(`Swagger: http://localhost:${port}/${swaggerPath}`);
  console.log(`===================================\n`);

  await app.listen(port);
}

bootstrap().catch(error => {
  console.error('Error al iniciar la aplicación:', error);
  process.exit(1);
});
