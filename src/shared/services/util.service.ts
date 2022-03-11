import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilService {

  // isDev(): boolean {
  //   const env = this.configService.get<string>('NODE_ENV');
  //   const envs = ['development', 'test', 'localhost', 'local'];
  //   return !env || envs.includes(env);
  // }
  group(array: any[], key: string): Promise<any[]> {
    return array.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
}
