import { AnyColumns } from './table';

export interface Query<C extends AnyColumns> {
  resultType: QueryResult<C>;

  toSQL(): string;
}

export type QueryResult<C extends AnyColumns> = {
  columns: C;
};
