import { Stack } from "../util/stack";
import { AstNode } from "../parser/ast-node";
import { CheckedError } from "../errors/checked-error";
import { AnalysysContext } from "../analysis/analysis-context";
import type { ImmutableVisitorsRegistry } from "./visitors-registry";

export class Traverser<T extends string, E extends CheckedError> {
  public static create<T extends string, E extends CheckedError>(
    root: AstNode<T>,
    context: AnalysysContext<E>,
    visitorsRegistry: ImmutableVisitorsRegistry<T, AnalysysContext<E>>
  ) {
    return new Traverser<T, E>(root, context, visitorsRegistry);
  }

  private nodeStack: Stack<AstNode<T>> = new Stack();

  private constructor(
    private readonly root: AstNode<T>,
    private readonly context: AnalysysContext<E>,
    private readonly visitorsRegistry: ImmutableVisitorsRegistry<T, AnalysysContext<E>>
  ) {
    this.nodeStack.push(this.root);
  }

  public startTraversing() {
    const {
      nodeStack: stack,
      visitorsRegistry: { transformers, analysts, childrenVisitors },
    } = this;

    while (stack.isNotEmpty()) {
      let node: AstNode<T> = stack.pop();
      const desugarer = transformers.get(node.type);
      if (desugarer !== undefined) {
        node = desugarer.tranformerFunction(node);
      }
      const analyst = analysts.get(node.type);
      if (analyst !== undefined) {
        analyst.analysisFunction(node, this.context);
      }
      const childrenVisitor = childrenVisitors.get(node.type);
      if (childrenVisitor !== undefined) {
        // @ts-expect-error - "lib/analysis/childre-visitor/Node<T>" type should be a subtype of "lib/parser/ast-node.AstNode<T>" 
        const childrens: Array<AstNode<T>> = childrenVisitor.childrenOf(node);
        stack.pushAll(childrens);
      }
    }
  }
}
