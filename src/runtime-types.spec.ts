import {
  array,
  boolean,
  constant,
  fn,
  null_,
  number,
  object,
  string,
  t,
  tuple,
  Type,
  undefined_,
  union,
  ValueOf,
} from './runtime-types';

describe('runtime-types', () => {
  it('type-checks properly', () => {
    const check = <T extends Type>(type: T, value: ValueOf<T>) => value;

    check(undefined_, undefined);
    check(null_, null);
    check(boolean, true);
    check(constant('hello' as const), 'hello');
    check(fn(t(number), string), (x) => `${x}`);
    check(fn(t(number, number), number), (a, b) => a + b);
    check(tuple(t(constant(1 as const), constant(2 as const), constant(3 as const))), [1, 2, 3]);
    check(union(t(number, string)), 123);
    check(union(t(number, string)), 'abc');
    check(array(number), [1, 2, 3]);
    check(object({ a: string, b: number }), { a: 'abc', b: 123 });
  });
});
