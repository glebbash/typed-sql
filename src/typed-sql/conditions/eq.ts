import { ValueOf } from '../../runtime-types';
import { Condition } from '../condition';
import { AnyColumns, FindColumnByName, NameUnionOf } from '../table';

export function eq<C extends AnyColumns, N extends NameUnionOf<C>>(
  columnName: N,
  value: ValueOf<FindColumnByName<C, N>['type']['valueType']>
): Condition<C> {
  return {
    toSQL: (columns) =>
      `${columnName} = ${columns.find((c) => c.name === columnName)?.type?.toSQL(value as never)}`,
  };
}
