import { ApiProperty, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { bootstrap } from './main';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

jest.mock('@nestjs/common', () => ({
  Logger: jest.fn().mockReturnValue({
    log: jest.fn(),
  }),
  ValidationPipe: jest.requireActual('@nestjs/common').ValidationPipe, // Tomar la implementación real
}));

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      setGlobalPrefix: jest.fn(),
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
      listen: jest.fn(),
    }),
  },
}));

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: jest.fn().mockReturnValue({
    setTitle: jest.fn().mockReturnThis(), // Retornar la misma instancia
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnThis(),
  }),
  //   ApiProperty: jest.fn(),
  SwaggerModule: {
    createDocument: jest.fn().mockReturnValue('document'), // Para evaluar el valor de retorno
    setup: jest.fn(), // Para evaluar sin el valor de retorno
  },
}));

jest.mock('./app.module', () => ({
  AppModule: jest.fn().mockRejectedValue('AppModule'),
}));

describe('Main.ts', () => {
  let mockApp: {
    setGlobalPrefix: jest.Mock;
    enableCors: jest.Mock;
    useGlobalPipes: jest.Mock;
    listen: jest.Mock;
  };

  let mockLogger: { log: jest.Mock };

  beforeEach(() => {
    mockApp = {
      setGlobalPrefix: jest.fn(),
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
      listen: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
    (Logger as unknown as jest.Mock).mockReturnValue(mockLogger);
  });

  it('should create the application with AppModule', async () => {
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(mockLogger.log).toHaveBeenCalledWith(`App running on port 3000`);
  });

  it('Should create the application running on env.PORT', async () => {
    process.env.PORT = '4000';

    await bootstrap();

    expect(mockLogger.log).toHaveBeenCalledWith('App running on port 4000');
  });

  it('should set global prefix', async () => {
    await bootstrap();

    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api');
  });

  it('should use global pipes', async () => {
    await bootstrap();

    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      // Contiene algunos elementos especificos del objeto
      expect.objectContaining({
        errorHttpStatusCode: 400,
        validatorOptions: expect.objectContaining({
          forbidNonWhitelisted: true,
          forbidUnknownValues: false,
          whitelist: true,
        }),
      }),
    );
  });

  it('should call DocumentBuilder', async () => {
    await bootstrap();

    expect(DocumentBuilder).toHaveBeenCalled();
    expect(DocumentBuilder).toHaveBeenCalledWith();
  });

  it('should create swagger document', async () => {
    await bootstrap();

    expect(SwaggerModule.createDocument).toHaveBeenCalled();
    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      'api',
      expect.anything(), // Espera cualquier cosa
      'document',
    );
  });
});
