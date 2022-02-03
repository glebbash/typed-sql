import {
  array,
  ArrayType,
  number,
  NumberType,
  object,
  ObjectType,
  string,
  StringType,
  Type,
  undefined_,
  UndefinedType,
  ValueOf,
} from './runtime-types';

export type DBType<T extends Type = Type> = {
  type: string;
  valueType: T;
  toSQL: (value: ValueOf<T>) => string;
};

export type Table<C extends Record<string, DBType>> = {
  name: string;
  columns: C;
};

export type AnyTable = Table<Record<string, DBType>>;

export type Selector<T extends AnyTable> = SelectAll | SelectColumns<T>;
export type SelectAll = { type: 'all' };
export type SelectColumns<T extends AnyTable, C extends keyof T['columns'] = keyof T['columns']> = {
  type: 'columns';
  columns: readonly C[];
};

export const ALL: SelectAll = { type: 'all' };

export type ResultTypeFromSelector<T extends AnyTable, S extends Selector<T>> = ArrayType<
  ObjectType<{ [K in GetSelectedColumnNames<T, S>]: T['columns'][K]['valueType'] }>
>;
export type GetSelectedColumnNames<
  T extends AnyTable,
  S extends Selector<T>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = S extends SelectColumns<infer _, infer C> ? C : keyof T['columns'];

export type Parameters = Record<string, unknown>;
export type NoParameters = Record<string, never>;

export type Condition<T extends AnyTable, P extends Parameters> = {
  build: (table: T, parameters: P) => string;
};

export interface SQLQuery<RT extends Type, P extends Parameters> {
  resultType: RT;

  build(parameters: P): string;
}

export function and<T extends AnyTable, P extends Parameters>(
  cond1: Condition<T, P>,
  cond2: Condition<T, P>
): Condition<T, P> {
  return {
    build: (table, parameters) =>
      `${cond1.build(table, parameters)} AND ${cond2.build(table, parameters)}`,
  };
}

export function eq<T extends AnyTable, C extends keyof T['columns'], P extends Parameters>(
  column: C,
  value: ValueOf<T['columns'][C]['valueType']>
): Condition<T, P> {
  return {
    build: (table) => `${column} = ${table.columns[column as string].toSQL(value as never)}`,
  };
}

export function where<T extends AnyTable, P extends Parameters>(
  condition: Condition<T, P>
): Condition<T, P> {
  return condition;
}

export function text(): DBType<StringType> {
  return {
    type: 'TEXT',
    valueType: string,
    toSQL: (value) => `'${value}'`,
  };
}

export function integer(): DBType<NumberType> {
  return {
    type: 'INTEGER',
    valueType: number,
    toSQL: (value) => `${value}`,
  };
}

export function table<C extends Record<string, DBType>>(name: string, columns: C): Table<C> {
  return { name, columns };
}

export function createTable<C extends Record<string, DBType>>(
  table: Table<C>
): SQLQuery<UndefinedType, NoParameters> {
  return {
    resultType: undefined_,
    build: () =>
      `CREATE TABLE ${table.name} (${Object.entries(table.columns)
        .map(([name, type]) => `${name} ${type.type}`)
        .join(', ')})`,
  };
}

export function select<T extends AnyTable, S extends Selector<T>, P extends Parameters>(
  selector: S,
  source: T,
  condition?: Condition<T, P>
): SQLQuery<ResultTypeFromSelector<T, S>, P> {
  return {
    resultType: array(
      object(
        Object.fromEntries(
          Object.entries(selectColumns(selector, source)).map(([name, type]) => [
            name,
            type.valueType,
          ])
        )
      )
    ) as never,
    build: (parameters) =>
      condition
        ? `SELECT ${selectorToSQL(selector)} FROM ${source.name} WHERE ${condition?.build(
            source,
            parameters
          )}`
        : `SELECT ${selectorToSQL(selector)} FROM ${source.name}`,
  };
}

function selectColumns<T extends AnyTable, S extends Selector<T>>(selector: S, source: T) {
  if (selector.type === 'all') {
    return source.columns;
  }

  return Object.fromEntries(
    Object.entries(source.columns).filter(([k]) => selector.columns.includes(k))
  );
}

export function columns<T extends AnyTable, C extends keyof T['columns']>(
  ...columns: readonly C[]
): SelectColumns<T, C> {
  return {
    type: 'columns',
    columns,
  };
}

export function from<T extends AnyTable>(source: T): T {
  return source;
}

function selectorToSQL<T extends AnyTable>(selector: Selector<T>): string {
  if (selector.type === 'all') {
    return '*';
  }

  return selector.columns.join(', ');
}
