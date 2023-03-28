import { Controller, Get, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from 'src/guard/rate-limit.guard';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @UseGuards(RateLimitGuard)
  @Get()
  async getData() {
    return await this.dataService.getData();
  }
}
