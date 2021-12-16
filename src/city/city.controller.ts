import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Logger } from 'winston';

import { CityService } from './city.service';
import { City, CityDocument } from './city.schema';
import { StatusCode } from '../shared/types';
import { ResponseService } from '../shared/services/response.service';
import { LOGGER } from '../shared/constants/schema';

@Controller('cities')
export class CityController {
  constructor(
    @Inject(LOGGER)
    private logger: Logger,
    private readonly cityService: CityService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      controller: 'CityController',
    });
  }
  @Post('')
  async createCity(
    @Res() res: Response,
    @Body() data: City,
  ): Promise<Response> {
    try {
      const responseData = await this.cityService.createNewCity(
        data,
        this.logger,
      );
      return this.responseService.json(
        res,
        StatusCode.Created,
        'your request was successful',
        responseData,
      );
    } catch (error) {
      console.log('here', error);
      this.logger.error(error);
      return this.responseService.json(res, error);
    }
  }

  @Get('')
  async listCities(@Res() res: Response): Promise<Response> {
    try {
      const responseData = await this.cityService.getAllCitiesLiveWeather();

      return this.responseService.json(
        res,
        StatusCode.Success,
        'cities retrieved successsfully',
        responseData,
      );
    } catch (error) {
      this.logger.error(error);
      return this.responseService.json(res, error);
    }
  }

  @Delete(':id')
  async deleteCity(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.cityService.deleteCity(id);

      return this.responseService.json(
        res,
        StatusCode.Success,
        'city has been deleted successsfully',
      );
    } catch (error) {
      this.logger.error(error);
      return this.responseService.json(res, error);
    }
  }

  @Get(':name/weather')
  async getCityLiveWeatherReport(
    @Param('name') name: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const city = await this.cityService.getCityByName(name, this.logger);

      return this.responseService.json(
        res,
        StatusCode.Success,
        'city has been retrieved successsfully',
        city,
      );
    } catch (error) {
      this.logger.error(error);
      return this.responseService.json(res, error);
    }
  }

  @Get('weather')
  async getCityLatestWeather(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const responseData = await this.cityService.getCity(id);

      return this.responseService.json(
        res,
        StatusCode.Success,
        'cities retrieved successsfully',
        responseData,
      );
    } catch (error) {
      this.logger.error(error);
      return this.responseService.json(res, error);
    }
  }
}
