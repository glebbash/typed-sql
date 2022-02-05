import { Apply, HKT } from '../hkt';
import { AnyColumns } from './table';

export type SelectorHKT = HKT<AnyColumns, AnyColumns>;

export type Selector<C extends AnyColumns, S extends SelectorHKT> = {
  select: (columns: C) => Apply<S, C>;
  toSQL: () => string;
};
