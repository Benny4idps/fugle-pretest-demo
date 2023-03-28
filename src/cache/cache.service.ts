import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RateLimitTypeEnum } from 'src/enum/rate-limit-key.enum';
import { LiveTradeDataModel } from 'src/model/live-trade-data.model';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  private async setData(key: string, value: any, ttl?: number) {
    this.cacheManager.set(key, value, { ttl });
  }

  private async getData<T>(key: string): Promise<T> {
    return this.cacheManager.get(key);
  }

  public async checkRateLimit(
    limitType: RateLimitTypeEnum,
    key: string,
    requestMinute: number,
  ) {
    let cacheData: number = await this.getData(
      `${limitType}:${key}:${requestMinute}`,
    );

    if (cacheData) cacheData++;
    await this.setData(
      `${limitType}:${key}:${requestMinute}`,
      cacheData || 1,
      60,
    );

    return cacheData;
  }

  public async updateCurrencyPriceData(
    currency: string,
    tradeData: LiveTradeDataModel,
  ) {
    const currencyPriceData: number[] =
      (await this.getData(
        `${currency}:${Math.floor(Number(tradeData.timestamp) / 60)}`,
      )) || [];

    currencyPriceData.push(tradeData.price);
    await this.setData(
      `${currency}:${Math.floor(Number(tradeData.timestamp) / 60)}`,
      currencyPriceData,
      120,
    );

    return {
      currency,
      latestPrice: tradeData.price,
      open: currencyPriceData[0],
      close: currencyPriceData[currencyPriceData.length - 1],
      high: Math.max(...currencyPriceData),
      low: Math.min(...currencyPriceData),
    };
  }
}
