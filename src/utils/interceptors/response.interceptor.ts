import { AppConfigModule } from '@config/app/config.module';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Resource } from '../base-class/base.resource';
import { ResponsePaginationInterceptor } from './list-response.interceptor';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  serializeName: Resource;

  constructor(serializeName: Resource) {
    this.serializeName = serializeName;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const reflector = new Reflector();

    const classInterceptors = reflector.get(
      '__interceptors__',
      context.getClass(),
    );
    const handlerInterceptors = reflector.get(
      '__interceptors__',
      context.getHandler(),
    );

    if (
      classInterceptors?.some(
        interceptor => interceptor instanceof ResponseInterceptor,
      ) &&
      handlerInterceptors?.some(
        interceptor => interceptor instanceof ResponsePaginationInterceptor,
      )
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data: Record<string, unknown>) => {
        const meta = data?.meta;

        if (meta) {
          const obj = data;
          delete obj.meta;
        }

        const baseResource = AppConfigModule.BaseResouce;
        // console.log(data)
        // console.log(this.serializeName)
        return baseResource.serialize(this.serializeName, data);
      }),
    );
  }
}
