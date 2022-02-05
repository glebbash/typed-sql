import { where } from '../condition';
import { integer, text } from '../data-types';
import { from, select } from '../queries/select';
import { ALL } from '../selectors/all';
import { table } from '../table';
import { and } from './and';
import { eq } from './eq';

describe('and', () => {
  const Resources = table('resources', [
    { name: 'id', type: integer() },
    { name: 'name', type: text() },
  ] as const);

  it('builds select all with and condition', () => {
    const query = select(ALL, from(Resources), where(and(eq('id', 2), eq('name', 'Wood'))));
    expect(query.toSQL()).toBe("SELECT * FROM resources WHERE id = 2 AND name = 'Wood'");
    expect(query.resultType).toStrictEqual({ columns: Resources.columns });
  });
});
