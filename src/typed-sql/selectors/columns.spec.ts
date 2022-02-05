import { integer, text } from '../data-types';
import { from, select } from '../queries/select';
import { table } from '../table';
import { columns } from './columns';

describe('columns', () => {
  const Resources = table('resources', [
    { name: 'id', type: integer() },
    { name: 'name', type: text() },
  ] as const);

  it('builds select query for one column', () => {
    const query = select(columns('id'), from(Resources));
    expect(query.toSQL()).toBe('SELECT id FROM resources');
    expect(query.resultType).toStrictEqual({ columns: [Resources.columns[0]] });
  });

  it('builds select query for multiple columns', () => {
    const query = select(columns('id', 'name'), from(Resources));
    expect(query.toSQL()).toBe('SELECT id, name FROM resources');
    expect(query.resultType).toStrictEqual({
      columns: [Resources.columns[0], Resources.columns[1]],
    });
  });

  it('builds select query for one column selected multiple times', () => {
    const query = select(columns('name', 'name'), from(Resources));
    expect(query.toSQL()).toBe('SELECT name, name FROM resources');
    expect(query.resultType).toStrictEqual({
      columns: [Resources.columns[1], Resources.columns[1]],
    });
  });

  it('fails to build query if columnNames is empty', () => {
    // TODO: try to emit type error in this case
    expect(() => select(columns(), from(Resources))).toThrow(
      new Error('Cannot create an empty selector')
    );
  });

  it('fails to build query if column name is not in the table', () => {
    const nonExistentColumnName = 'non-existent-column';
    // TODO: try to emit type error in this case
    expect(() => select(columns(nonExistentColumnName), from(Resources))).toThrow(
      new Error(`Cannot find column by name '${nonExistentColumnName}'`)
    );
  });
});
