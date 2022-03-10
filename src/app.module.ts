import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { CityModule } from './city/city.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';
import { WardModule } from './ward/ward.module';
import * as mongoosePopulate from 'mongoose-autopopulate';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().database.url, {
      connectionFactory: (connection) => {
        // applies plugin to all schema
        connection.plugin(mongoosePopulate);
        return connection;
      },
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ScheduleModule.forRoot(),
    { module: LoggerModule, global: true },
    WeatherModule,
    CityModule,
    UserModule,
    WardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
