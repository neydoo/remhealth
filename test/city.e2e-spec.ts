import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CityService } from '../src/city/city.service';

const cityService = {
  createNewCity: () => ({}),
  getAllCitiesLiveWeather: () => ({}),
  deleteCity: () => ({}),
  getCityByName: () => ({}),
  getCity: () => ({}),
};
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CityService)
      .useValue(cityService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/cities (GET)', () => {
    return request(app.getHttpServer())
      .get('/cities')
      .expect(200)
      .expect({ message: 'cities retrieved successsfully', data: {} });
  });

  it('/cities (POST)', () => {
    return request(app.getHttpServer())
      .post('/cities')
      .expect(201)
      .expect({ message: 'your request was successful', data: {} });
  });

  it('/cities/weather (GET)', () => {
    return request(app.getHttpServer())
      .get('/cities/weather')
      .expect(200)
      .expect({ message: 'cities retrieved successsfully', data: {} });
  });

  it('/cities/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/cities/1234')
      .expect(200)
      .expect({ message: 'city has been deleted successsfully' });
  });

  it('/cities/:name/weather (GET)', () => {
    return request(app.getHttpServer())
      .get('/cities/Lagos/weather')
      .expect(200)
      .expect({ message: 'city has been retrieved successsfully', data: {} });
  });
});
