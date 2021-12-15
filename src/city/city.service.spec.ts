import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CITY } from '../shared/constants/schema';
import { rootMongooseTestModule, mockRepository } from '../../test/mongo-config';
import { LoggerModule } from '../logger/logger.module';
import { City, CitySchema } from './city.schema';
import { CityService } from './city.service';
import { WeatherModule } from '../weather/weather.module';

describe('CityService', () => {
  let service: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WeatherModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: CITY, schema: CitySchema }]),
      ],
      providers: [
        CityService,
        LoggerModule,
        {
          provide: getModelToken(City.name),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
