import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PARENT } from '@rem/shared/constants/schema';
import { ParentService } from './parent.service';
import { ParentSchema } from './schema/parent.schema';

@Module({
  providers: [ParentService],
  exports: [ParentService],
  imports: [
    MongooseModule.forFeature([{ name: PARENT, schema: ParentSchema }]),
  ],
})
export class ParentModule {}
