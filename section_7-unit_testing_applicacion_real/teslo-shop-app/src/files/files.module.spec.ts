import { Test, TestingModule } from '@nestjs/testing';
import { FilesModule } from './files.module';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

describe('File Module', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [FilesModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should contain FileController and FileService', () => {
    const filesService = module.get<FilesService>(FilesService);
    const filesController = module.get<FilesController>(FilesController);

    expect(filesService).toBeDefined();
    expect(filesController).toBeDefined();
  });
});
