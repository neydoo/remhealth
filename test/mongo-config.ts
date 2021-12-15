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
  if (mongod) await mongod.stop();
};

export const mockRepository = {
  findOne: () => {
    return { exec: jest.fn(() => {}) };
  },
  findById: () => {
    return { exec: jest.fn(() => {}) };
  },
  findByIdAndRemove: () => {
    return { exec: jest.fn(() => {}) };
  },
  deleteMany: () => {
    return { exec: jest.fn(() => {}) };
  },
  create: jest.fn(() => {}),
  aggregate: jest.fn(() => [{}]),
};
