import { ApiProperty } from '@nestjs/swagger';
import { bootstrap } from './main';

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
  it('should configure app', async () => {
    await bootstrap();
  });
});
