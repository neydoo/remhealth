import { Response } from 'express';
import { MongooseModule } from '@nestjs/mongoose';

import { Test, TestingModule } from '@nestjs/testing';
import { CITY } from '../shared/constants/schema';
import { WeatherModule } from '../weather/weather.module';
import { createMock } from '@golevelup/ts-jest';

import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-config';
import { LoggerModule } from '../logger/logger.module';
import { CityController } from './city.controller';
import { City, CityDocument, CitySchema } from './city.schema';
import { CityService } from './city.service';
import { ResponseService } from '../shared/services/response.service';

const mockResponseObject = () => {
  return createMock<Response>({
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  });
};
const cityService = {
  createNewCity: () => ({}),
  getAllCitiesLiveWeather: () => ({}),
  deleteCity: () => ({}),
  getCityByName: () => ({}),
  getCity: () => ({}),
};
describe('CityController', () => {
  let controller: CityController;
  let spyService: CityService;

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
    })
      .overrideProvider(CityService)
      .useValue(cityService)
      .compile();

    controller = module.get<CityController>(CityController);
    spyService = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createNewCity', async () => {
    const citySpy = jest.spyOn(spyService, 'createNewCity');
    const res = mockResponseObject();
    const city = new City() as CityDocument;
    await controller.createCity(res, city);
    expect(citySpy).toBeCalled();
  });

  it('should call getAllCitiesLiveWeather', async () => {
    const citySpy = jest.spyOn(spyService, 'getAllCitiesLiveWeather');
    const res = mockResponseObject();
    await controller.listCities(res);
    expect(citySpy).toBeCalled();
  });

  it('should call deleteCity', async () => {
    const citySpy = jest.spyOn(spyService, 'deleteCity');
    const res = mockResponseObject();
    await controller.deleteCity('1234', res);
    expect(citySpy).toBeCalled();
  });

  it('should call getCityByName', async () => {
    const citySpy = jest.spyOn(spyService, 'getCityByName');
    const res = mockResponseObject();
    await controller.getCityLiveWeatherReport('London', res);
    expect(citySpy).toBeCalled();
  });

  it('should call getCity', async () => {
    const citySpy = jest.spyOn(spyService, 'getCity');
    const res = mockResponseObject();
    await controller.getCityLatestWeather('12345', res);
    expect(citySpy).toBeCalled();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
