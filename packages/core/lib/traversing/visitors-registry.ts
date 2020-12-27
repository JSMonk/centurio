import { AstNode } from "../parser/ast-node";
import { InvalidOperationError } from "../errors";
import { AnalystOpts, NodeAnalyst } from "../analysis/node-analyst";
import { ChildrenVisitor, VisitorOpts } from "./chilren-visitor";
import { DesugarerOpts, NodeDesugarer } from "../desugar/node-desugarer";

export class VisitorsRegistry<T extends string, C extends object> {
  public static create<T extends string, C extends object>() {
    return new VisitorsRegistry<T, C>();
  }

  private transformers: Map<string, NodeDesugarer<T, AstNode<T>>> = new Map();
  private analysts: Map<string, NodeAnalyst<T, C>> = new Map();
  private childrenVisitors: Map<string, ChildrenVisitor<T, string>> = new Map();
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

  desugarWhen(opts: DesugarerOpts<T, AstNode<T>>) {
    this.assertNotFixed();
    this.transformers.set(opts.type, NodeDesugarer.forNode(opts));
    return this;
  }

  analyse(opts: AnalystOpts<T, C>) {
    this.assertNotFixed();
    this.analysts.set(opts.type, NodeAnalyst.forNode(opts));
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

export class ImmutableVisitorsRegistry<T extends string, C extends object> {
  constructor(
    public readonly transformers: ReadonlyMap<
      string,
      NodeDesugarer<T, AstNode<T>>
    >,
    public readonly analysts: ReadonlyMap<string, NodeAnalyst<T, C>>,
    public readonly childrenVisitors: ReadonlyMap<
      string,
      ChildrenVisitor<T, string>
    >
  ) {}
}
