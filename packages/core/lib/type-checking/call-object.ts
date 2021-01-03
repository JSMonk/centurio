import { Call } from "./interfaces/call";
import { Type } from "./interfaces/type";
import { Typable } from "./interfaces/typable";
import { Callable } from "./interfaces/callable";

export type CallObjectOpts = {
  args: Typable[];
  callee: Typable & Callable;
  type?: Type<object>;
};

export class CallObject implements Call {
  public static with(opts: CallObject) {
    return new CallObject(opts.args, opts.callee, opts.type ?? Type.Unknown);
  }

  private constructor(
    public readonly args: Typable[],
    public readonly callee: Typable & Callable,
    public type: Type<object> = Type.Unknown
  ) {}
}
