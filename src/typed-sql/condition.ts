import { AnyColumns } from './table';

export type Condition<C extends AnyColumns> = {
  toSQL: (columns: C) => string;
};

export function where<C extends AnyColumns>(condition: Condition<C>): Condition<C> {
  return condition;
}
