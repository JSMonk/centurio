import { AstNode } from "../parser/ast-node";
import { InvalidOperationError } from "../errors";
import { AnalystOpts, NodeAnalyst } from "../analysis/node-analyst";
import { ChildrenVisitor, VisitorOpts } from "./chilren-visitor";
import { DesugarerOpts, NodeDesugarer } from "../desugar/node-desugarer";

export class VisitorsRegistry<T, C extends object> {
  public static create<T, C extends object>() {
    return new VisitorsRegistry<T, C>();
  }

  private transformers: Map<T, NodeDesugarer<T, AstNode<T>>> = new Map();
  private analysts: Map<T, NodeAnalyst<T, AstNode<T>, C>> = new Map();
  private childrenVisitors: Map<T, ChildrenVisitor<T, string>> = new Map();
  private hasBeenFixed: boolean = false;

  private constructor() {}

  private assertNotFixed() {
    if (this.hasBeenFixed) {
      throw new InvalidOperationError(
        "Attempt to mutate fixed VisitorsRegistry!"
      );
    }
  }

  traverseIn<K extends string>(opts: VisitorOpts<T, K>) {
    this.assertNotFixed();
    this.childrenVisitors.set(opts.type, ChildrenVisitor.forNode<T, K>(opts));
    return this;
  }

  desugarWhen<N extends AstNode<T>>(opts: DesugarerOpts<T, N>) {
    this.assertNotFixed();
    this.transformers.set(
      opts.type,
      NodeDesugarer.forNode(opts) as NodeDesugarer<T, AstNode<T>>
    );
    return this;
  }

  analyse<N extends AstNode<T>>(opts: AnalystOpts<T, N, C>) {
    this.assertNotFixed();
    this.analysts.set(
      opts.type,
      NodeAnalyst.forNode(opts) as NodeAnalyst<T, AstNode<T>, C>
    );
    return this;
  }

  fixed() {
    this.hasBeenFixed = true;
    return new ImmutableVisitorsRegistry(
      this.transformers,
      this.analysts,
      this.childrenVisitors
    );
  }
}

export class ImmutableVisitorsRegistry<T, C extends object> {
  constructor(
    public readonly transformers: ReadonlyMap<T, NodeDesugarer<T, AstNode<T>>>,
    public readonly analysts: ReadonlyMap<T, NodeAnalyst<T, AstNode<T>, C>>,
    public readonly childrenVisitors: ReadonlyMap<T, ChildrenVisitor<T, string>>
  ) {}
}
