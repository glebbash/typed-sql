import { Apply } from '../../hkt';
import { Condition } from '../condition';
import { Query } from '../query';
import { Selector, SelectorHKT } from '../selector';
import { AnyColumns, AnyTable, Table } from '../table';

export function select<C extends AnyColumns, S extends SelectorHKT>(
  selector: Selector<C, S>,
  source: Table<C>,
  condition?: Condition<C>
): Query<Apply<S, C>> {
  return {
    resultType: { columns: selector.select(source.columns) },
    toSQL: () =>
      condition
        ? `SELECT ${selector.toSQL()} FROM ${source.name} WHERE ${condition.toSQL(source.columns)}`
        : `SELECT ${selector.toSQL()} FROM ${source.name}`,
  };
}

export function from<T extends AnyTable>(source: T): T {
  return source;
}
