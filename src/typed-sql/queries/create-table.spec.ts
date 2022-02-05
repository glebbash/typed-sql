import { integer, text } from '../data-types';
import { table } from '../table';
import { createTable } from './create-table';

describe('createTable', () => {
  const Resources = table('resources', [
    { name: 'id', type: integer() },
    { name: 'name', type: text() },
  ] as const);

  it('builds create table query', () => {
    const query = createTable(Resources);
    expect(query.toSQL()).toBe('CREATE TABLE resources (id INTEGER, name TEXT)');
    expect(query.resultType).toStrictEqual({ columns: [] });
  });
});
