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

import { RegisterWard, StatusCode } from '../shared/types';
import { ResponseService } from '../shared/services/response.service';
import { LOGGER } from '../shared/constants/schema';
import { WardService } from './ward.service';
import { Ward } from './schema/ward.schema';
import { Parent } from 'parent/schema/parent.schema';
import { ParentService } from 'parent/parent.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('ward')
export class WardController {
  constructor(
    @Inject(LOGGER)
    private logger: Logger,
    private readonly wardService: WardService,
    private readonly parentService: ParentService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      controller: 'WardController',
    });
  }

  @Post('register')
  @ApiBody({ type: RegisterWard })
  async createWard(
    @Res() res: Response,
    @Body() data: RegisterWard,
  ): Promise<Response> {
    const {
      dob,
      email,
      phone,
      firstName,
      lastName,
      otherName,
      country,
      state,
    } = data;
    try {
      const parentData: Parent = {
        email,
        phone,
        country,
        state,
      };
      const parent = await this.parentService.addParent(parentData);

      const wardData: Ward = {
        dob,
        firstName,
        lastName,
        otherName,
        parent: parent.id,
      };
      const responseData = await this.wardService.addWard(wardData);
      return this.responseService.json(
        res,
        StatusCode.Created,
        'your request was successful',
        responseData,
      );
    } catch (error) {
      this.logger.error(error);
      return this.responseService.json(res, error);
    }
  }
}
