import { where } from '../condition';
import { and } from '../conditions/and';
import { eq } from '../conditions/eq';
import { integer, text } from '../data-types';
import { columns } from '../selectors/columns';
import { table } from '../table';
import { from, select } from './select';

describe('select', () => {
  const Resources = table('resources', [
    { name: 'id', type: integer() },
    { name: 'name', type: text() },
  ] as const);

  it('builds complex select query', () => {
    const query = select(
      columns('id', 'name'),
      from(Resources),
      where(and(eq('id', 2), eq('name', 'Wood')))
    );
    expect(query.toSQL()).toBe("SELECT id, name FROM resources WHERE id = 2 AND name = 'Wood'");
    expect(query.resultType).toStrictEqual({
      columns: [Resources.columns[0], Resources.columns[1]],
    });
  });
});
