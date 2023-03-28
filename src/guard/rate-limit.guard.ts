import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { RateLimitTypeEnum } from 'src/enum/rate-limit-key.enum';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private cacheService: CacheService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.query.user;
    const ip = request.ip;
    const requestMinute = Math.floor(Date.now() / 60000);

    if (!userId) {
      throw new BadRequestException('userId required');
    }

    const userRequestRate = await this.cacheService.checkRateLimit(
      RateLimitTypeEnum.User,
      userId,
      requestMinute,
    );

    const IPRequestRate = await this.cacheService.checkRateLimit(
      RateLimitTypeEnum.IP,
      ip,
      requestMinute,
    );
    if (userRequestRate > 5 || IPRequestRate > 10) {
      throw new HttpException(
        { ip: IPRequestRate, id: userRequestRate },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
