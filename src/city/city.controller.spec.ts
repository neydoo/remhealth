import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CITY } from '../shared/constants/schema';
import { WeatherModule } from '../weather/weather.module';
import { rootMongooseTestModule } from '../../test/mongo-config';

import { LoggerModule } from '../logger/logger.module';
import { CityController } from './city.controller';
import { CitySchema } from './city.schema';
import { CityService } from './city.service';
import { ResponseService } from '../shared/services/response.service';

describe('CityController', () => {
  let controller: CityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WeatherModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: CITY, schema: CitySchema }]),
        LoggerModule,
      ],
      providers: [CityService, ResponseService],
      controllers: [CityController],
    }).compile();

    controller = module.get<CityController>(CityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
