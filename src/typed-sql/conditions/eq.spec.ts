import { where } from '../condition';
import { integer, text } from '../data-types';
import { from, select } from '../queries/select';
import { ALL } from '../selectors/all';
import { table } from '../table';
import { eq } from './eq';

describe('eq', () => {
  const Resources = table('resources', [
    { name: 'id', type: integer() },
    { name: 'name', type: text() },
  ] as const);

  it('builds select all query with eq condition', () => {
    const query = select(ALL, from(Resources), where(eq('id', 2)));
    expect(query.toSQL()).toBe('SELECT * FROM resources WHERE id = 2');
    expect(query.resultType).toStrictEqual({ columns: Resources.columns });
  });
});
