import { AstNode } from "../parser/ast-node";

type AnalysysFunction<T, N extends AstNode<T>, C extends object> = (
  node: N,
  context: C
) => void;

export type AnalystOpts<T, N extends AstNode<T>, C extends object> = {
  type: T;
  analyze: AnalysysFunction<T, N, C>;
};

export class NodeAnalyst<T, N extends AstNode<T>, C extends object> {
  public static forNode<T, N extends AstNode<T>, C extends object>(
    opts: AnalystOpts<T, N, C>
  ) {
    return new NodeAnalyst<T, N, C>(opts.type, opts.analyze);
  }

  private constructor(
    public readonly type: T,
    public readonly analysisFunction: AnalysysFunction<T, N, C>
  ) {}
}
