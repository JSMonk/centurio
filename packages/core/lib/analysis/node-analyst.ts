import { AstNode } from "../parser/ast-node";

type AnalysysFunction<T extends string, C extends object> = (
  node: AstNode<T>,
  context: C
) => void;

export type AnalystOpts<T extends string, C extends object> = {
  type: T;
  analyze: AnalysysFunction<T, C>;
};

export class NodeAnalyst<T extends string, C extends object> {
  public static forNode<T extends string, C extends object>(
    opts: AnalystOpts<T, C>
  ) {
    return new NodeAnalyst<T, C>(opts.type, opts.analyze);
  }

  private constructor(
    public readonly type: T,
    public readonly analysisFunction: AnalysysFunction<T, C>
  ) {}
}
