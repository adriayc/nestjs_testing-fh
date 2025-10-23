import { Controller } from '@nestjs/common';
import { FilesController } from './files.controller';
import { Test } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';

describe('File Controller', () => {
  let controller: FilesController;
  let filesService: FilesService;

  beforeEach(async () => {
    const mockFilesService = {
      getStaticProductImage: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    };

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
      controllers: [FilesController],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
