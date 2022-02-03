import { array, number, object, string, undefined_ } from './runtime-types';
import {
  ALL,
  and,
  columns,
  createTable,
  eq,
  from,
  integer,
  select,
  table,
  text,
  where,
} from './typed-sql';

describe('typed-sql', () => {
  const Resources = table('resources', {
    id: integer(),
    name: text(),
  });

  it('builds create table query', () => {
    const query = createTable(Resources);
    expect(query.build({})).toBe('CREATE TABLE resources (id INTEGER, name TEXT)');
    expect(query.resultType).toStrictEqual(undefined_);
  });

  it('builds select all query', () => {
    const query = select(ALL, from(Resources));
    expect(query.build({})).toBe('SELECT * FROM resources');
    expect(query.resultType).toStrictEqual(array(object({ id: number, name: string })));
  });

  it('builds select query for one column', () => {
    const query = select(columns('name'), from(Resources));
    expect(query.build({})).toBe('SELECT name FROM resources');
    expect(query.resultType).toStrictEqual(array(object({ name: string })));
  });

  it('builds select query for one column', () => {
    const query = select(columns('name', 'name'), from(Resources));
    expect(query.build({})).toBe('SELECT name FROM resources');
    expect(query.resultType).toStrictEqual(array(object({ name: string })));
  });

  it('builds select query for multiple columns', () => {
    const query = select(columns('id', 'name'), from(Resources));
    expect(query.build({})).toBe('SELECT id, name FROM resources');
    expect(query.resultType).toStrictEqual(array(object({ id: number, name: string })));
  });

  it('builds select all query with simple condition', () => {
    const query = select(ALL, from(Resources), where(eq('id', 2)));
    expect(query.build({})).toBe('SELECT * FROM resources WHERE id = 2');
    expect(query.resultType).toStrictEqual(array(object({ id: number, name: string })));
  });

  it('builds select all query with nested condition', () => {
    const query = select(ALL, from(Resources), where(and(eq('id', 2), eq('name', 'Wood'))));
    expect(query.build({})).toBe("SELECT * FROM resources WHERE id = 2 AND name = 'Wood'");
    expect(query.resultType).toStrictEqual(array(object({ id: number, name: string })));
  });

  it('builds select query for multiple fields with nested condition', () => {
    const query = select(
      columns('id', 'name'),
      from(Resources),
      where(and(eq('id', 2), eq('name', 'Wood')))
    );
    expect(query.build({})).toBe("SELECT id, name FROM resources WHERE id = 2 AND name = 'Wood'");
    expect(query.resultType).toStrictEqual(array(object({ id: number, name: string })));
  });
});
