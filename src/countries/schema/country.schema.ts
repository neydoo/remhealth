import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseSchemaDecorator } from '../../shared/decorators/base_schema.decorator';

export enum CountryCurrencyType {
  Naira = 'Naira',
}

export type CountryDocument = Country & Document;

@BaseSchemaDecorator()
export class Country {
  @ApiProperty({ description: 'area code of the country' })
  @Prop({
    default: null,
    required: false,
  })
  areaCodes: string[];

  @ApiProperty({ description: 'image url of the country' })
  @Prop({
    type: String,
    default: null,
    required: false,
  })
  imageUrl: string;

  @Prop()
  code: string;

  @Prop()
  dialCode: string;

  @Prop()
  iso2: string;

  @ApiProperty({ description: 'name of the country' })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop()
  priority: number;

  @Prop()
  symbol: string;

  @Prop({
    default: true,
    required: false,
  })
  isActive: boolean;

  @Prop({
    type: String,
    ref: 'User',
  })
  lastEditedBy: string;
}

const CountrySchema = SchemaFactory.createForClass(Country);

export { CountrySchema };
