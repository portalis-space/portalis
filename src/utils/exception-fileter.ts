import { UserLog, UserLogDocument } from '@config/dbs/user-log.model';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as JSONAPISerializer from 'json-api-serializer';
import { LoggersService } from 'modules/loggers/loggers.service';
import { Model } from 'mongoose';
import { ResultStatusEnum } from './enums/result-status.enum';

// tslint:disable-next-line:variable-name
// tslint:disable-next-line:variable-name
const Serializer = new JSONAPISerializer();

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly log: LoggersService) {}
  async catch(exception: HttpException | any, host: ArgumentsHost) {
    // console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const request = ctx.getRequest();

    // const isAcceptedApiV1 = request.url.includes('api/v1');

    const { url, user } = request;
    // const PRISMA_404_CODE = ['P2025'];
    // let status;
    // switch (true) {
    //   case exception instanceof HttpException || exception?.getStatus?.():
    //     status = +exception.getStatus();
    //     break;
    //   case PRISMA_404_CODE.includes(exception?.code):
    //     status = HttpStatus.NOT_FOUND;
    //     break;
    //   default:
    //     status = HttpStatus.INTERNAL_SERVER_ERROR;
    //     break;
    // }
    const status =
      exception instanceof HttpException || exception?.getStatus?.()
        ? +exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const stack = !exception.stack ? null : exception.stack;
    const errorResponse = exception?.response;
    if (process.env.ENV != 'production') {
      console.log('\x1b[36m', stack, '\x1b[0m');
    }
    const errorCode = errorResponse?.error || errorResponse?.code || undefined;
    const errorMessage =
      errorResponse?.message || exception?.message || exception;

    const errorDetail = exception?.meta;

    let errorDefault = {
      statusCode: status,
      meta: { timestamp: new Date().toISOString() },
      path: url,
      code: errorCode || exception?.code,
      message: errorMessage,
    };

    if (errorDetail && typeof errorDetail === 'object' && errorDetail.length) {
      const error = errorDetail.map(message => ({
        ...errorDefault,
        detail: message,
      }));

      errorDefault = error;
    }
    await this.log.userLog({
      user: request.user?._id,
      result: ResultStatusEnum.FAILED,
      errorConsole: stack,
      request: request.body,
      requestPath: request.url,
      response: errorDefault,
    });
    // console.log(errorDefault);
    response.status(status).json(Serializer.serializeError(errorDefault));
    // if (isAcceptedApiV1) {
    //   const errorDefaultApiV1: any = {
    //     statusCode: status,
    //     result: false,
    //     method: method,
    //     path: url,
    //     message: errorMessage,
    //   };
    // response.status(status).json(errorDefault);
    // } else {
    //   response.status(status).json(Serializer.serializeError(errorDefault));
    // }
  }
}
