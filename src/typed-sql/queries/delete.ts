import { Condition } from '../condition';
import { Query } from '../query';
import { AnyTable } from '../table';

export function delete_<T extends AnyTable>(
  table: T,
  condition?: Condition<T['columns']>
): Query<[]> {
  return {
    resultType: { columns: [] },
    toSQL: () =>
      condition
        ? `DELETE FROM ${table.name} WHERE ${condition.toSQL(table.columns)}`
        : `DELETE FROM ${table.name}`,
  };
}
