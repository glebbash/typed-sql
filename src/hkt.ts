// HKT implementation based on https://gitlab.com/brett-mitchell-dev/miscellany/types/-/tree/master

export interface HKT<P = unknown, R = unknown> {
  params: P;
  result: R;
}

export type Apply<Fn extends HKT, Params> = (Fn & { params: Params })['result'];
