import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

import { BaseSchemaDecorator } from '../../shared/decorators/base_schema.decorator';
import { STATE } from '@rem/shared/constants/schema';
import { StateDocument } from './state.schema';

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
  timeZone: string;

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

  // virtual fields
  states?: StateDocument[];
}

const CountrySchema = SchemaFactory.createForClass(Country);
CountrySchema.virtual('states', {
  ref: STATE,
  autopopulate: true,
  localField: '_id',
  foreignField: 'country',
});
CountrySchema.plugin(mongoosePaginate);
export { CountrySchema };
