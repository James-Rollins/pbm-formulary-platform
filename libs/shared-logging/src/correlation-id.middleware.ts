import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

declare module 'express-serve-static-core' {
  interface Request {
    correlationId?: string;
  }
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerName = 'x-correlation-id';

    const incoming =
      (req.headers[headerName] as string | undefined) ||
      (req.headers[headerName.toLowerCase()] as string | undefined);

    const correlationId = incoming?.trim() || randomUUID();

    req.correlationId = correlationId;
    res.setHeader(headerName, correlationId);

    next();
  }
}
