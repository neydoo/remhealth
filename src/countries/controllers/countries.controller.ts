import {
  Controller,
  Get,
  Query,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  Body,
} from '@nestjs/common';

import { Response } from 'express';

import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ResponseService } from '../../shared/services/response.service';
import { Country } from '../schema/country.schema';
import CountriesService from '../services/countries.service';

@ApiTags('countries')
@Controller('countries')
export default class CountriesController {
  constructor(
    private readonly countryService: CountriesService,
    private responseService: ResponseService,
  ) {}

  /**
   * Get all paginated countries
   *
   * @param req
   * @param query
   */
  @Get('/')
  @ApiResponse({ status: 201, description: 'countries retrieved' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async index(@Query() query: string): Promise<any[]> {
    return this.countryService.index(query);
  }

  /**
   * Get all countries
   *
   * @param req
   * @param query
   */
  @Get('/all')
  @ApiResponse({ status: 201, description: 'countries retrieved' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async all(@Res() res: Response): Promise<any> {
    try {
      const countries = await this.countryService.all();
      return this.responseService.json(res, 200, '', countries);
    } catch (error) {
      return this.responseService.json(res, error);
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('/create')
  @ApiResponse({ status: 201, description: 'country saved' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async create(@Body() data: any): Promise<Country> {
    return this.countryService.create(data);
  }
}
