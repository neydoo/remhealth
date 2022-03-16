import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { COUNTRY } from '@rem/shared/constants/schema';
import { Document, SchemaTypes } from 'mongoose';
import { IsNotEmpty } from 'class-validator';
import { BaseSchemaDecorator } from '../../shared/decorators/base_schema.decorator';

export type StateDocument = State & Document;

@BaseSchemaDecorator()
export class State {
  @ApiProperty({ description: 'name of the state' })
  @IsNotEmpty()
  @Prop({
    default: null,
    required: true,
  })
  name: string;

  @ApiProperty({ description: 'code of the state' })
  @IsNotEmpty()
  @Prop({
    type: String,
    default: null,
    required: false,
  })
  code?: string;

  @Prop({
    default: true,
    required: false,
  })
  isActive?: boolean;

  @Prop({
    type: String,
    ref: 'User',
  })
  lastEditedBy?: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: COUNTRY,
  })
  country: string;
}

const StateSchema = SchemaFactory.createForClass(State);

export { StateSchema };
