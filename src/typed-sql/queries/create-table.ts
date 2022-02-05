import { Query } from '../query';
import { AnyColumns, Table } from '../table';

export function createTable<C extends AnyColumns>(table: Table<C>): Query<[]> {
  return {
    resultType: { columns: [] },
    toSQL: () =>
      `CREATE TABLE ${table.name} (${table.columns
        .map(({ name, type }) => `${name} ${type.type}`)
        .join(', ')})`,
  };
}
