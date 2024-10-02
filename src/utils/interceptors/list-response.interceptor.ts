import { AppConfigModule } from '@config/app/config.module';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Resource } from '../base-class/base.resource';
import { circularToJSON } from '../helpers';

type Meta = {
  currentRecordCount: number;
  totalRecordCount: number;
  totalPage: number;
  currentPage: number;
  perPage: number;
  startOf: number;
};

@Injectable()
export class ResponsePaginationInterceptor<T>
  implements NestInterceptor<T, any>
{
  serializeName: Resource;

  offset;

  /**
   * @property
   * @type {string}
   * all query inserted when access endpoint
   */
  queryString = '';

  /**
   * endpoint url
   */
  pathname = '';

  /**
   * @property
   * @type {Object}
   * all query inserted when access endpoint
   */
  query = {
    page: undefined,
    size: undefined,
  };

  constructor(serializeName: Resource) {
    this.serializeName = serializeName;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.query = request.query;

    return next.handle().pipe(
      map(resp => {
        const { count, rows, ...additionalMeta } = circularToJSON(resp);

        // eslint-disable-next-line no-underscore-dangle
        this.queryString = request._parsedUrl.query || '';
        // eslint-disable-next-line no-underscore-dangle
        this.pathname = request._parsedUrl.pathname;

        // make to json serialize
        const baseResource = AppConfigModule.BaseResouce;
        const resource = baseResource.serialize(this.serializeName, rows);

        const meta = this.meta(count, rows, additionalMeta);

        return { ...resource, meta, links: this.links(meta) };
      }),
    );
  }

  /**
   * link of response
   * @param param0
   */
  private links({ currentPage, totalPage }: Meta) {
    // LINKS

    const self = () => this.linkQueries(currentPage);
    const prev = () => {
      const prevPage = +currentPage - 1;
      if (prevPage < 1) return undefined;

      return this.linkQueries(prevPage);
    };
    const next = () => {
      if (+currentPage >= +totalPage) return undefined;

      return this.linkQueries(+currentPage + 1);
    };

    const last = () => {
      if (!+totalPage) return undefined;
      return this.linkQueries(totalPage);
    };

    return {
      self: self(),
      prev: prev(),
      next: next(),
      last: last(),
    };
  }

  private linkQueries(itsPage: number): string {
    const updatedQuery = this.queryString.replace(
      `page=${this.query.page}`,
      `page=${itsPage}`,
    );

    if (!updatedQuery) return this.pathname;
    return `${this.pathname}?${updatedQuery}`;
  }

  /**
   * generate meta of response pagination
   * @param count
   * @param rows
   * @param additionalMeta
   */
  private meta(count, rows: any[], additionalMeta: any): Meta {
    // META
    const { size, page } = this.query;
    const total: number =
      typeof count === 'object' ? count?.length || 0 : count;

    const totalPage = size ? Math.ceil(total / size) : 1;

    const offset = size && page ? size * page - +size : 0;

    return (
      (total >= 0 && {
        totalRecordCount: total,
        currentRecordCount: rows?.length || 0,
        totalPage: totalPage || 1,
        currentPage: +(additionalMeta?.meta?.page || page || 1),
        perPage: +(size || rows?.length),
        startOf: (count && offset + 1) || 1,
        ...additionalMeta,
      }) ||
      undefined
    );
  }
}
