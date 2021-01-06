import { readFileSync } from "fs";
import {
  SyntaxKind,
  ScriptTarget,
  createSourceFile,
  Node as TSNode,
  TypeAliasDeclaration,
  TypeNode,
  TypeLiteralNode,
} from "typescript";
import { Type } from "../../../core/lib/type-checking/interfaces/type";
import { AstNode } from "../../../core/lib/parser/ast-node";
import { Traverser } from "../../../core/lib/traversing/traverser";
import { CheckedError } from "../../../core/lib/errors/checked-error";
import { TypeProperty } from "./type-property";
import { AnalysisContext } from "../../../core/lib/analysis/analysis-context";
import { VisitorsRegistry } from "../../../core/lib/traversing/visitors-registry";
import { DefinitionAnalyzer } from "../../../core/lib/analysis/definitions-analyzer";

export class TypeScriptDefinitionsAnalyzer<
  N,
  C extends AnalysisContext<CheckedError>
> extends DefinitionAnalyzer<SyntaxKind, N, C> {
  public async analyze(path: string): Promise<void> {
    const program = this.parse(path);

    const registry: VisitorsRegistry<SyntaxKind, C> = this.visitor;
    this.defineAstTraversingRules(registry);
    this.addTypesInLanguageContext(registry);

    const traverser = Traverser.create({
      context: this.context,
      root: program,
      registry: registry.fixed(),
      getNodeType: (node) => node.kind,
    });

    traverser.startTraversing();
  }

  private parse(path: string): TSNode {
    const declarations = readFileSync(path, "utf8");
    return createSourceFile(path, declarations, ScriptTarget.ES2015, false);
  }

  private addTypesInLanguageContext(registry: VisitorsRegistry<SyntaxKind, C>) {
    return registry.analyse({
      type: SyntaxKind.TypeAliasDeclaration,
      analyze: (
        node: AstNode<SyntaxKind.TypeAliasDeclaration> & TypeAliasDeclaration,
        context: AnalysisContext<CheckedError>
      ) => {
        if (!this.isPublicDefinition(node)) {
          return;
        }
        const typeNode = node.type;
        if (!this.isTypeLiteral(typeNode)) {
          return;
        }
        // TODO: remove the bulshit
        const typeName = (typeNode.members.find(
          (e) => (e.name as any)?.escapedText === TypeProperty.NAME
        ) as any)?.type?.literal?.text;

        if (typeName === undefined) {
          return;
        }

        const type = Type.create({ name: typeName, supertypes: [] });
        context.language.types.set(typeName, type);
        //
        // TODO: remove the bulshit
        const forNodes = (typeNode.members.find(
          (e) => (e.name as any)?.escapedText === TypeProperty.FOR_NODES
        ) as any)?.type?.elements ?? [];

        forNodes.forEach(node => {
          this.mixTypeAnnotation(node.literal.text, type);
        })
      },
    });
  }

  private isTypeLiteral(node: TypeNode): node is TypeLiteralNode {
    return node.kind === SyntaxKind.TypeLiteral;
  }

  private mixTypeAnnotation(nodeType: N, type: Type<object>) {
    this.language.visitor.desugarWhen({
      type: nodeType,
      map(node: AstNode<N>) {
        return Object.assign(node, { _type: type });
      },
    });
  }

  private isPublicDefinition(node: TSNode) {
    return (
      node.modifiers?.find((n) => n.kind === SyntaxKind.ExportKeyword) !==
      undefined
    );
  }

  private defineAstTraversingRules(registry: VisitorsRegistry<SyntaxKind, C>) {
    return registry.traverseIn({
      type: SyntaxKind.SourceFile,
      children: ["statements"],
    });
  }
}
