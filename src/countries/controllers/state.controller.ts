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
import { StatesService } from '../services/state.service';
import { StateDocument } from 'countries/schema/state.schema';

@ApiTags('states')
@Controller('states')
export default class CountriesController {
  constructor(
    private readonly stateService: StatesService,
    private responseService: ResponseService,
  ) {}

  /**
   * Get all paginated states
   *
   * @param req
   * @param query
   */
  @Get('/')
  @ApiResponse({ status: 201, description: 'states retrieved' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async index(@Query() query: string): Promise<any[]> {
    return this.stateService.index(query);
  }

  /**
   * Get all states
   *
   * @param req
   * @param query
   */
  @Get('/all')
  @ApiResponse({ status: 201, description: 'states retrieved' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async all(@Res() res: Response): Promise<any> {
    try {
      const states = await this.stateService.all();
      return this.responseService.json(res, 200, '', states);
    } catch (error) {
      return this.responseService.json(res, error);
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('/create')
  @ApiResponse({ status: 201, description: 'state saved' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async create(@Body() data: any): Promise<StateDocument> {
    return this.stateService.create(data);
  }
}
