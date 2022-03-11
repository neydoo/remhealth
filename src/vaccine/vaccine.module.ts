import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VACCINE } from '@rem/shared/constants/schema';
import { VaccineSchema } from './schema/vaccine.schema';
import { VaccineService } from './vaccine.service';

@Module({
  providers: [VaccineService],
  exports: [VaccineService],
  imports: [
    MongooseModule.forFeature([{ name: VACCINE, schema: VaccineSchema }]),
  ],
})
export class VaccineModule {}
