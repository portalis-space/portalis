export interface IPaginate {
  page: number;
  size: number;
}

export class basePagination implements IPaginate {
  constructor(_page: number, _size: number) {
    this.page = _page ?? 0;
    this.size = _size ?? 10;
  }

  page: number;
  size: number;

  getPage() {
    return this.page - 1 == 0 || this.page < 0
      ? 0
      : (this.page - 1) * this.size;
  }

  getSize() {
    return this.size < 1 ? 10 : this.size;
  }
}
