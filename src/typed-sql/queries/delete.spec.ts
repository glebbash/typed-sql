import { where } from '../condition';
import { eq } from '../conditions/eq';
import { integer, text } from '../data-types';
import { table } from '../table';
import { delete_ } from './delete';
import { from } from './select';

describe('delete_', () => {
  const Resources = table('resources', [
    { name: 'id', type: integer() },
    { name: 'name', type: text() },
  ] as const);

  it('creates delete query without condition', () => {
    const query = delete_(from(Resources));
    expect(query.toSQL()).toBe('DELETE FROM resources');
    expect(query.resultType).toStrictEqual({ columns: [] });
  });

  it('creates delete query with condition', () => {
    const query = delete_(from(Resources), where(eq('id', 1)));
    expect(query.toSQL()).toBe('DELETE FROM resources WHERE id = 1');
    expect(query.resultType).toStrictEqual({ columns: [] });
  });
});
