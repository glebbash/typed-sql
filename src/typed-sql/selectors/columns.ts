import { Selector, SelectorHKT } from '../selector';
import { AnyColumns, FindColumnByName, NameUnionOf } from '../table';

export type GetSelectedColumns<
  C extends AnyColumns,
  N extends readonly string[]
> = N extends readonly []
  ? readonly []
  : N extends readonly [infer N1, ...infer NS]
  ? N1 extends string
    ? NS extends readonly string[]
      ? readonly [FindColumnByName<C, N1>, ...GetSelectedColumns<C, NS>]
      : never
    : never
  : never;

export interface ColumnSelectorHKT<N extends readonly string[]> extends SelectorHKT {
  result: GetSelectedColumns<this['params'], N>;
}

export function columns<C extends AnyColumns, N extends readonly NameUnionOf<C>[]>(
  ...columnNames: N
): Selector<C, ColumnSelectorHKT<N>> {
  if (columnNames.length === 0) {
    throw new Error('Cannot create an empty selector');
  }

  return {
    select: (columns) =>
      columnNames.map((columnName) => {
        const column = columns.find((c) => c.name === columnName);

        if (!column) {
          throw new Error(`Cannot find column by name '${columnName}'`);
        }

        return column;
      }) as never,
    toSQL: () => columnNames.join(', '),
  };
}
