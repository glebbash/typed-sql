export type Type = { type: string };

export type UndefinedType = Type & { type: 'undefined' };
export type NullType = Type & { type: 'null' };
export type BooleanType = Type & { type: 'boolean' };
export type NumberType = Type & { type: 'number' };
export type StringType = Type & { type: 'string' };
export type ConstantType<T> = Type & { type: 'constant'; value: T };
export type ArrayType<T extends Type> = Type & { type: 'array'; elementType: T };
export type ObjectType<P extends Record<string, Type>> = Type & { type: 'object'; properties: P };
export type TupleType<TS extends readonly Type[]> = Type & { type: 'tuple'; values: TS };
export type UnionType<TS extends readonly Type[]> = Type & { type: 'union'; options: TS };
export type FnType<I extends readonly Type[], O extends Type> = Type & {
  type: 'fn';
  input: I;
  output: O;
};

export type ValueOf<T> = T extends UndefinedType
  ? undefined
  : T extends NullType
  ? null
  : T extends BooleanType
  ? boolean
  : T extends NumberType
  ? number
  : T extends StringType
  ? string
  : T extends ConstantType<infer X>
  ? X
  : T extends ArrayType<infer T>
  ? ValueOf<T>[]
  : T extends ObjectType<infer P>
  ? { [K in keyof P]: ValueOf<P[K]> }
  : T extends TupleType<infer TS>
  ? ValueOfEach<TS>
  : T extends UnionType<infer TS>
  ? ValueOf<ArrayToUnion<TS>>
  : T extends FnType<infer I, infer O>
  ? (...args: ValueOfEach<I>) => ValueOf<O>
  : never;

// Helpers

export type ArrayToUnion<A> = A extends readonly [infer X, ...infer XS]
  ? X | ArrayToUnion<XS>
  : never;
export type ValueOfEach<A> = A extends []
  ? []
  : A extends readonly [infer X, ...infer XS]
  ? [ValueOf<X>, ...ValueOfEach<XS>]
  : never;

export const t = <XS extends readonly unknown[]>(...values: XS): XS => values;

// runtime type constructors

export const null_: NullType = { type: 'null' };
export const undefined_: UndefinedType = { type: 'undefined' };
export const boolean: BooleanType = { type: 'boolean' };
export const number: NumberType = { type: 'number' };
export const string: StringType = { type: 'string' };

export const constant = <T>(value: T): ConstantType<T> => ({
  type: 'constant',
  value,
});

export const tuple = <TS extends readonly Type[]>(values: TS): TupleType<TS> => ({
  type: 'tuple',
  values,
});

export const union = <TS extends readonly Type[]>(options: TS): UnionType<TS> => ({
  type: 'union',
  options,
});

export const array = <T extends Type>(elementType: T): ArrayType<T> => ({
  type: 'array',
  elementType,
});

export const object = <P extends Record<string, Type>>(properties: P): ObjectType<P> => ({
  type: 'object',
  properties,
});

export const fn = <I extends readonly Type[], O extends Type>(
  input: I,
  output: O
): FnType<I, O> => ({
  type: 'fn',
  input,
  output,
});
