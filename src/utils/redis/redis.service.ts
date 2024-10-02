import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async setValue(
    key: string,
    value: string,
    expseconds: number,
  ): Promise<void> {
    await this.redisClient.set(key, value, 'EX', expseconds);
  }

  async getValue(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async delValue(key: string): Promise<boolean> {
    return (await this.redisClient.del(key)) == 1;
  }

  async delKeys(pattern: string): Promise<number> {
    const keys = await this.redisClient.keys(pattern);
    if (keys.length == 0) return;
    return await this.redisClient.del(keys);
  }
}
