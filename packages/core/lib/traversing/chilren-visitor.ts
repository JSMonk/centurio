import { InvalidStateError } from "../errors/invalid-state-error";
import { AstNode } from "../parser/ast-node";

export type VisitorOpts<T, K extends string> = {
  type: T;
  children: K[];
};
type Node<T, K extends string> = AstNode<T> & Record<K, unknown>;

export class ChildrenVisitor<T, K extends string> {
  public static forNode<T, K extends string = string>(
    opts: VisitorOpts<T, K>
  ): ChildrenVisitor<T, K> {
    return new ChildrenVisitor<T, K>(opts.type, opts.children);
  }

  private constructor(
    public readonly type: T,
    private childrenPropetries: K[]
  ) {}

  public childrenOf<N extends Node<T, K>>(node: N): Array<N[K]> {
    const { childrenPropetries } = this;
    let children: Array<N[K]> = [];
    for (let i = 0; i < childrenPropetries.length; i++) {
      const property = childrenPropetries[i];
      if (property === undefined) {
        throw new InvalidStateError(
          "childrenPropetries contains holes or undefined values inside"
        );
      }
      const value = node[property];
      if (Array.isArray(value)) {
        children = [...children, ...value];
      } else {
        children.push(value);
      }
    }
    return children;
  }
}
