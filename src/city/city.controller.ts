import { Response } from 'express';
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
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
      const responseData = await this.cityService.createCity(data);
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
      const responseData = await this.cityService.getAllCityWeather();

      return res.status(StatusCode.Success).send({
        message: 'url has been successfully decoded',
        data: responseData,
      });
    } catch (error) {
      return res.status(StatusCode.Failure).send({
        message: error.message || 'an error occurred while retrieving url',
      });
    }
  }
}
