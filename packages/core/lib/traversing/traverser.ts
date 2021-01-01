import { Stack } from "../util/stack";
import { AstNode } from "../parser/ast-node";
import { CheckedError } from "../errors/checked-error";
import { AnalysisContext } from "../analysis/analysis-context";
import type { ImmutableVisitorsRegistry } from "./visitors-registry";

export type TraverserOpts<T, N extends AstNode<T>, E extends CheckedError> = {
  root: N;
  context: AnalysisContext<E>;
  registry: ImmutableVisitorsRegistry<T, AnalysisContext<E>>;
  getNodeType: (node: N) => T;
};

export class Traverser<T, N extends AstNode<T>, E extends CheckedError> {
  public static create<T, N extends AstNode<T>, E extends CheckedError>(
    opts: TraverserOpts<T, N, E>
  ) {
    return new Traverser<T, N, E>(
      opts.root,
      opts.getNodeType,
      opts.context,
      opts.registry
    );
  }

  private nodeStack: Stack<N> = new Stack();

  private constructor(
    private readonly root: N,
    private readonly getNodeType: (node: N) => T,
    private readonly context: AnalysisContext<E>,
    private readonly visitorsRegistry: ImmutableVisitorsRegistry<
      T,
      AnalysisContext<E>
    >
  ) {
    this.nodeStack.push(this.root);
  }

  public startTraversing() {
    const {
      nodeStack: stack,
      visitorsRegistry: { transformers, analysts, childrenVisitors },
    } = this;

    while (stack.isNotEmpty()) {
      let node: N = stack.pop();
      let type = this.getNodeType(node);
      const desugarer = transformers.get(type);
      if (desugarer !== undefined) {
        node = desugarer.tranformerFunction(node) as N;
        type = this.getNodeType(node);
      }
      const analyst = analysts.get(type);
      if (analyst !== undefined) {
        analyst.analysisFunction(node, this.context);
      }
      const childrenVisitor = childrenVisitors.get(type);
      if (childrenVisitor !== undefined) {
        // @ts-expect-error: TypeScript can't inference node as AstNode<T> and { [k: string]: any }
        const childrens = childrenVisitor.childrenOf(node);
        stack.pushAll(childrens as Array<N>);
      }
    }
  }
}
