import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product, ProductImage } from './entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { BadRequestException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

describe('Product Service', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let productImageRepository: Repository<ProductImage>;

  beforeEach(async () => {
    const mockProductRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      findOneBy: jest.fn(),
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      preload: jest.fn(),
      remove: jest.fn(),
    };

    const mockProductImageRepository = {
      save: jest.fn(),
      create: jest.fn(),
    };

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        manager: {
          delete: jest.fn(),
          save: jest.fn(),
        },
        commitTransaction: jest.fn(),
        release: jest.fn(),
        rollbackTransaction: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        // Casi el 100% de los atributos definidos en el constructor van en el provider
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductImage),
          useValue: mockProductImageRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    productImageRepository = module.get<Repository<ProductImage>>(
      getRepositoryToken(ProductImage),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const dto = {
      title: 'Test Product',
      price: 100,
      images: ['imag1.png'],
    } as CreateProductDto;

    const { images: dtoWithNoImages, ...createDto } = dto;

    const user = {
      id: '1',
      email: 'test@mail.com',
    } as User;

    const product = {
      id: '1',
      ...createDto,
      user,
    } as unknown as Product;

    jest.spyOn(productRepository, 'create').mockReturnValue(product);
    jest.spyOn(productRepository, 'save').mockResolvedValue(product);
    jest
      .spyOn(productImageRepository, 'create')
      .mockImplementation((imageData) => imageData as unknown as ProductImage);

    const result = await service.create(dto, user);
    // console.log(result);

    expect(result).toEqual({
      id: '1',
      title: 'Test Product',
      price: 100,
      images: ['imag1.png'],
      user: { id: '1', email: 'test@mail.com' },
    });
  });

  it('should throw a BadRequestException if create product fails', async () => {
    const dto = {} as CreateProductDto;
    const user = {} as User;

    jest.spyOn(productRepository, 'save').mockRejectedValue({
      code: '23505',
      detail: 'The product has not been created',
    });

    await expect(service.create(dto, user)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.create(dto, user)).rejects.toThrow(
      'The product has not been created',
    );
  });

  it('should find all products', async () => {
    const dto = {
      limit: 10,
      offset: 0,
      gender: 'men',
    } as PaginationDto;

    const products = [
      {
        id: '1',
        title: 'Product #1',
        price: 100,
        images: [{ id: '1', url: 'image1.jpg' }],
      },
      {
        id: '2',
        title: 'Product #2',
        price: 200,
        images: [{ id: '2', url: 'image2.jpg' }],
      },
    ] as unknown as Product[];

    const totalProducts = products.length;

    jest.spyOn(productRepository, 'find').mockResolvedValue(products);
    jest.spyOn(productRepository, 'count').mockResolvedValue(totalProducts);

    const result = await service.findAll(dto);
    // console.log(result);

    expect(result).toEqual({
      count: 2,
      pages: 1,
      products: products.map((product) => ({
        ...product,
        images: product.images.map((img) => img.url),
      })),
    });
  });
});
