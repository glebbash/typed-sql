import { AnyColumnType } from './data-types';

export type Column<N extends string, CT extends AnyColumnType> = {
  name: N;
  type: CT;
};

export type AnyColumn = Column<string, AnyColumnType>;

export type AnyColumns = readonly AnyColumn[];

export type Table<C extends AnyColumns> = {
  name: string;
  columns: C;
};

export type AnyTable = Table<AnyColumns>;

export type NameUnionOf<C extends AnyColumns> = ColumnName<C[keyof C]>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ColumnName<C> = C extends Column<infer N, infer _> ? N : never;

export type FindColumnByName<C extends AnyColumns, N extends string> = C extends readonly [
  infer C1,
  ...infer CS
]
  ? C1 extends Column<N, infer CT>
    ? Column<N, CT>
    : CS extends AnyColumns
    ? FindColumnByName<CS, N>
    : never
  : never;

export function table<C extends AnyColumns>(name: string, columns: C): Table<C> {
  return { name, columns };
}
