import { AstNode } from "../parser/ast-node";

export type TransformerFunction<T, N extends AstNode<T>> = (
  node: N
) => AstNode<T>;

export type DesugarerOpts<T, N extends AstNode<T>> = {
  type: T;
  map: TransformerFunction<T, N>;
};

export class NodeDesugarer<T, N extends AstNode<T>> {
  public static forNode<T, N extends AstNode<T>>(
    opts: DesugarerOpts<T, N>
  ) {
    return new NodeDesugarer<T, N>(opts.type, opts.map);
  }

  private constructor(
    public readonly type: T,
    public readonly tranformerFunction: TransformerFunction<T, N>
  ) {}
}
