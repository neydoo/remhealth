/**
 * DTO Object for creating new transactions.
 */

import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateCountryDto {
  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  areaCodes?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  code?: string;

  @ApiProperty()
  @IsString()
  dialCode?: string;

  @ApiProperty()
  @IsString()
  iso2?: string;

  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsNumber()
  priority?: number;

  @ApiProperty()
  @IsString()
  symbol?: string;

  @ApiProperty()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  lastEditedBy: string;
}
