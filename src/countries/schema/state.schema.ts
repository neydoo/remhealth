import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
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
    required: true,
  })
  code: string;

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

const StateSchema = SchemaFactory.createForClass(State);

export { StateSchema };
