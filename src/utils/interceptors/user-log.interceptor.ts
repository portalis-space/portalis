import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ResultStatusEnum } from '@utils/enums/result-status.enum';
import { LoggersService } from 'modules/loggers/loggers.service';
import { Observable, tap } from 'rxjs';

@Injectable()
export class UserLogInterceptor implements NestInterceptor {
  constructor(private readonly log: LoggersService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { url, body, method, query } = request;
    return next.handle().pipe(
      tap(() => {
        // console.log(request);
        if (!url.split('/').includes('signin') || method != 'GET') {
          this.log.userLog({
            user: request.user?._id,
            result: ResultStatusEnum.SUCCESS,
            request: body,
            requestPath: url,
            method,
            requestQuery: query,
          });
        }
      }),
    );
  }
}
