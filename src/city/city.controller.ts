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

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  @Post('')
  async createCity(
    @Res() res: Response,
    @Body() data: CityDocument,
  ): Promise<Response> {
    try {
      const responseData = await this.cityService.createNewCity(data);
      return res.status(StatusCode.Success).send({
        message: 'url successfully encoded',
        data: responseData,
      });
    } catch (error) {
      return res.status(StatusCode.Failure).json({
        message: error.message || 'an error occurred while encoding url',
      });
    }
  }

  @Get('')
  async listCities(@Res() res: Response): Promise<Response> {
    try {
      const responseData = await this.cityService.getAllCities();

      return res.status(StatusCode.Success).send({
        message: 'cities retrieved successsfully',
        data: responseData,
      });
    } catch (error) {
      return res.status(StatusCode.Failure).send({
        message: error.message || 'an error occurred while retrieving cities',
      });
    }
  }

  @Delete(':id')
  async deleteCity(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.cityService.deleteCity(id);

      return res.status(StatusCode.Success).send({
        message: 'city has been deleted successsfully',
      });
    } catch (error) {
      return res.status(StatusCode.Failure).send({
        message: error.message || 'an error occurred while retrieving cities',
      });
    }
  }

  @Get(':name/weather')
  async getCityLiveWeatherReport(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.cityService.getCityByName(id);

      return res.status(StatusCode.Success).send({
        message: 'city weather information has been retrieved successsfully',
      });
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

      return res.status(StatusCode.Success).send({
        message: 'cities retrieved successsfully',
        data: responseData,
      });
    } catch (error) {
      return res.status(StatusCode.Failure).send({
        message: error.message || 'an error occurred while retrieving cities',
      });
    }
  }
}
