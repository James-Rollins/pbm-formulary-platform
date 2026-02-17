import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { Request, Response } from 'express';

export type RequestLoggingOptions = {
  excludePaths?: string[];
};

export const REQUEST_LOGGING_OPTIONS = 'REQUEST_LOGGING_OPTIONS';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(
    @Optional()
    @Inject(REQUEST_LOGGING_OPTIONS)
    private readonly options: RequestLoggingOptions = {},
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request & { correlationId?: string }>();
    const res = httpContext.getResponse<Response>();

    // Skip noisy endpoints (e.g., health checks), including prefixed routes.
    if (this.shouldSkipLogging(req.originalUrl)) {
      return next.handle();
    }

    const start = process.hrtime.bigint(); // higher precision timing

    return next.handle().pipe(
      tap({
        next: () => {
          this.log(req, res, start);
        },
        error: () => {
          this.log(req, res, start); // still log if error occurs
        },
      }),
    );
  }

  private shouldSkipLogging(originalUrl: string): boolean {
    const excludedPaths = this.options.excludePaths ?? [];
    if (excludedPaths.length === 0) {
      return false;
    }

    // `originalUrl` may include query strings; compare pathnames only.
    const requestPath = this.normalizePath(originalUrl.split('?')[0] ?? '/');

    return excludedPaths.some((path) => {
      const excludedPath = this.normalizePath(path);
      return (
        requestPath === excludedPath ||
        requestPath.endsWith(excludedPath)
      );
    });
  }

  private normalizePath(path: string): string {
    if (!path.startsWith('/')) {
      return `/${path}`;
    }

    // Treat `/health` and `/health/` as equivalent.
    return path.length > 1 ? path.replace(/\/+$/, '') : path;
  }

  private log(
    req: Request & { correlationId?: string },
    res: Response,
    start: bigint,
  ) {
    const durationMs =
      Number(process.hrtime.bigint() - start) / 1_000_000;

    const logEntry = {
      correlationId: req.correlationId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs),
    };

    // Intentionally NOT logging:
    // - request body (PHI risk)
    // - headers (auth tokens)
    // - query params (may contain sensitive data)
    console.log(logEntry);
  }
}
