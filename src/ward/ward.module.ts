import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from '@rem/notification/notification.module';
import { WARD } from '@rem/shared/constants/schema';
import { UtilService } from '@rem/shared/services/util.service';
import { VaccineModule } from '@rem/vaccine/vaccine.module';
import { WardSchema } from './schema/ward.schema';
import { WardService } from './ward.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WARD, schema: WardSchema }]),
    NotificationModule,
    VaccineModule,
  ],
  providers: [WardService, UtilService],
})
export class WardModule {}
