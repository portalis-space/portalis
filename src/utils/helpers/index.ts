import { ClassTransformOptions, plainToInstance } from 'class-transformer';

export const circularToJSON = (circular: unknown) =>
  JSON.parse(JSON.stringify(circular));

export function transformer<T, V>(
  cls: { new (...args: unknown[]): T },
  obj: V[],
  options?: ClassTransformOptions,
): T[];
export function transformer<T, V>(
  cls: { new (...args: unknown[]): T },
  obj: V,
  options?: ClassTransformOptions,
): T;
export function transformer(...args: any[]) {
  const result = plainToInstance(args[0], circularToJSON(args[1]), {
    excludeExtraneousValues: true,
    exposeUnsetFields: true,
    enableImplicitConversion: true,
    // exposeDefaultValues: true,
    ...args[2],
  });
  return result as unknown;
}

// export function formatDateOnly(obj: string): string {
//   return moment(obj).format('YYYY-MM-DD');
// }

export function isEmpty(data: any = null): boolean {
  let result = false;
  if (typeof data === 'object') {
    if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]')
      result = true;
    if (!data) result = true;
  } else if (typeof data === 'string') {
    if (!data.trim()) result = true;
  } else if (typeof data === 'undefined') {
    result = true;
  }

  return result;
}

export const generateRandomNumber = (length: number) =>
  [...Array(length)].map(() => (Math.random() * 9 + 1) | 0).join(''); // non zero

/**
 * convert text into slug format
 *
 * @export
 * @param {string} text
 * @return {*}
 */
export function slugify(text: string) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
