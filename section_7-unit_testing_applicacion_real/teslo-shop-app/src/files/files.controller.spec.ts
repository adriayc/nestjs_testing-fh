import { BadRequestException, Controller } from '@nestjs/common';
import { FilesController } from './files.controller';
import { Test } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { fileNamer } from './helpers';

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
    filesService = module.get(FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return file path when findProductImage is called', () => {
    const mockResponse = { sendFile: jest.fn() } as unknown as Response;
    const imageName = 'test-image.jpg';
    const filePath = `/static/products/${imageName}`;

    jest.spyOn(filesService, 'getStaticProductImage').mockReturnValue(filePath);

    controller.findProductImage(mockResponse, imageName);

    expect(mockResponse.sendFile).toHaveBeenCalled();
    expect(mockResponse.sendFile).toHaveBeenCalledWith(filePath);
  });

  it('should return a secureUrl uploadProduct image is called with a file', () => {
    const file = {
      file: 'test-image.jpg',
      filename: 'testImage.jpg',
    } as unknown as Express.Multer.File;

    const result = controller.uploadProductImage(file);
    // console.log(result);

    expect(result).toEqual({
      secureUrl: 'http://localhost:3000/files/product/testImage.jpg',
      fileName: 'testImage.jpg',
    });
  });

  it('should throw a badRequestException if no file was provided', () => {
    expect(() => controller.uploadProductImage(null)).toThrow(
      new BadRequestException('Make sure that the file is an image'),
    );
  });
});
