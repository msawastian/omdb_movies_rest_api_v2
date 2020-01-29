import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ConfigService } from '~config/config.service';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly limiter: RateLimiterMemory;

  constructor(private readonly configService: ConfigService) {
    const points = parseInt(this.configService.getConfig('OMDB_API_RATE_LIMITER_POINTS'), 10);
    const duration = parseInt(this.configService.getConfig('OMDB_API_RATE_LIMITER_INTERVAL'), 10);

    this.limiter = new RateLimiterMemory({
      keyPrefix: 'middleware',
      points,
      duration
    });
  }

  async use(req: Request, res: Response, next: Function) {
    try {
      await this.limiter.consume(req.ip, 1);
      next();
    } catch (error) {
      res.status(429).send('Too many requests.')
    }
  }
}
