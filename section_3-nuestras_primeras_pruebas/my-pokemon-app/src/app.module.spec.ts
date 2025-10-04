import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsModule } from './pokemons/pokemons.module';

describe('AppModule', () => {
  let appController: AppController;
  let appService: AppService;
  let pokemosModule: PokemonsModule;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
    pokemosModule = moduleRef.get<PokemonsModule>(PokemonsModule);
  });

  it('should be defined with proper elements', () => {
    expect(appController).toBeDefined();
    expect(appService).toBeDefined();
    expect(pokemosModule).toBeDefined();
  });
});
