import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DataService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getData() {
    const dataEndpoint = this.configService.get('DATA_ENDPOINT');
    try {
      const { data } = await lastValueFrom(this.httpService.get(dataEndpoint));
      return { result: data };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
