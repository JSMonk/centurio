import { Type } from "./interfaces/type";
import type { Typable } from "./interfaces/typable";

export type LiteralOpts<T> = {
  type: Type<object>;
  value: T;
};
export class Literal<T> implements Typable {
  public static of<T>(opts: LiteralOpts<T>) {
    return new Literal(opts.type, opts.value);
  }

  private constructor(
    public readonly type: Type<object>,
    public readonly value: T
  ) {}
}
