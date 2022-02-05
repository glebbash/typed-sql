import { Condition } from '../condition';
import { AnyColumns } from '../table';

export function and<C extends AnyColumns>(cond1: Condition<C>, cond2: Condition<C>): Condition<C> {
  return {
    toSQL: (columns) => `${cond1.toSQL(columns)} AND ${cond2.toSQL(columns)}`,
  };
}
