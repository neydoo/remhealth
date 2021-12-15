/* eslint-disable @typescript-eslint/no-empty-function */
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) {
    await mongod.stop();
  } else {
    console.log('nada');
  }
};

export const mockRepository = {
  findOne: () => ({}),
  updateOne: () => ({}),
  findById: () => jest.fn(() => {}),
  find: () => jest.fn(() => [{}]),
  findByIdAndRemove: () => jest.fn(() => {}),
  deleteMany: () => jest.fn(() => {}),
  save: jest.fn(() => {}),
  create: jest.fn(() => {}),
  aggregate: jest.fn(() => [{}]),
};
