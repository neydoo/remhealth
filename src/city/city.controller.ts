import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CityDocument } from './city.schema';
import { StatusCode } from 'src/shared/types';
import { ResponseService } from 'src/shared/services/response.service';

@Controller('cities')
export class CityController {
  constructor(
    private readonly cityService: CityService,
    private responseService: ResponseService,
  ) {}
  @Post('')
  async createCity(
    @Res() res: Response,
    @Body() data: CityDocument,
  ): Promise<Response> {
    try {
      const responseData = await this.cityService.createNewCity(data);
      return this.responseService.json(
        res,
        StatusCode.Created,
        'your request was successful',
        responseData,
      );
    } catch (error) {
      console.log('here', error);
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
      return res.status(StatusCode.Failure).send({
        message: error.message || 'an error occurred while retrieving cities',
      });
    }
  }

  @Get(':name/weather')
  async getCityLiveWeatherReport(
    @Param('name') name: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const city = await this.cityService.getCityByName(name);

      return this.responseService.json(
        res,
        StatusCode.Success,
        'city has been retrieved successsfully',
        city,
      );
    } catch (error) {
      return res.status(StatusCode.Failure).send({
        message:
          error.message || 'an error occurred while retrieving weather info',
      });
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
      return res.status(StatusCode.Failure).send({
        message: error.message || 'an error occurred while retrieving cities',
      });
    }
  }
}
