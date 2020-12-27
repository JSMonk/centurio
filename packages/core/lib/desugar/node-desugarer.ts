import { AstNode } from "../parser/ast-node";

export type TransformerFunction<T extends string, R extends AstNode<T>> = (
  node: AstNode<T>
) => R;

export type DesugarerOpts<T extends string, R extends AstNode<T>> = {
  type: T;
  map: TransformerFunction<T, R>;
};

export class NodeDesugarer<T extends string, R extends AstNode<T>> {
  public static forNode<T extends string, R extends AstNode<T>>(
    opts: DesugarerOpts<T, R>
  ) {
    return new NodeDesugarer<T, R>(opts.type, opts.map);
  }

  private constructor(
    public readonly type: T,
    public readonly tranformerFunction: TransformerFunction<T, R>
  ) {}
}
