import { readFileSync } from "fs";
import {
  SyntaxKind,
  ScriptTarget,
  createSourceFile,
  Node as TSNode,
  TypeAliasDeclaration,
} from "typescript";
import { Type } from "../../../core/lib/type-checking/interfaces/type";
import { AstNode } from "../../../core/lib/parser/ast-node";
import { Traverser } from "../../../core/lib/traversing/traverser";
import { CheckedError } from "../../../core/lib/errors/checked-error";
import { AnalysisContext } from "../../../core/lib/analysis/analysis-context";
import { LanguageAnalyzer } from "../../../core/lib/analysis/language-analyzer";
import { VisitorsRegistry } from "../../../core/lib/traversing/visitors-registry";

export class TypeScriptDefinitionsAnalyzer<
  C extends AnalysisContext<CheckedError>
> extends LanguageAnalyzer<SyntaxKind, C> {
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
        const typeName = node.name.text;
        context.language.types.set(
          typeName,
          Type.create({ name: typeName, supertypes: [] })
        );
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
