import { Selector, SelectorHKT } from '../selector';
import { AnyColumns } from '../table';

export interface AllSelectorHKT extends SelectorHKT {
  result: this['params'];
}

export const ALL: Selector<AnyColumns, AllSelectorHKT> = {
  select: (columns) => columns,
  toSQL: () => '*',
};
