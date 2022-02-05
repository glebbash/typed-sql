import { integer, text } from '../data-types';
import { from, select } from '../queries/select';
import { table } from '../table';
import { ALL } from './all';

describe('all', () => {
  const Resources = table('resources', [
    { name: 'id', type: integer() },
    { name: 'name', type: text() },
  ] as const);

  it('builds select all query', () => {
    const query = select(ALL, from(Resources));
    expect(query.toSQL()).toBe('SELECT * FROM resources');
    expect(query.resultType).toStrictEqual({ columns: Resources.columns });
  });
});
