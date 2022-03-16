import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from '@rem/notification/notification.module';
import { WARD } from '@rem/shared/constants/schema';
import { UtilService } from '@rem/shared/services/util.service';
import { VaccineModule } from '@rem/vaccine/vaccine.module';
import { WardSchema } from './schema/ward.schema';
import { WardService } from './ward.service';
import { WardController } from './ward.controller';
import { ParentModule } from 'parent/parent.module';
import { ResponseService } from '@rem/shared/services/response.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WARD, schema: WardSchema }]),
    NotificationModule,
    VaccineModule,
    ParentModule,
  ],
  providers: [WardService, UtilService, ResponseService],
  controllers: [WardController],
})
export class WardModule {}
