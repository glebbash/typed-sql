import { number, NumberType, string, StringType, Type, ValueOf } from '../runtime-types';

export type ColumnType<T extends Type> = {
  type: string;
  valueType: T;
  toSQL: (value: ValueOf<T>) => string;
};

export type AnyColumnType = ColumnType<Type>;

export function text(): ColumnType<StringType> {
  return {
    type: 'TEXT',
    valueType: string,
    toSQL: (value) => `'${value}'`,
  };
}

export function integer(): ColumnType<NumberType> {
  return {
    type: 'INTEGER',
    valueType: number,
    toSQL: (value) => `${value}`,
  };
}
