import { readFile } from "../../../core/lib/parser/file";
import { AstStream } from "../../../core/lib/parser/ast-stream";
import { Traverser } from "../../../core/lib/traversing/traverser";
import { WordStream } from "../../../core/lib/parser/word-stream";
import { GuuTokenizer } from "./guu-tokenizer";
import { TokensStream } from "../../../core/lib/parser/tokens-stream";
import { GuuAstBuilder } from "./ast-builder";
import { GuuASTNodeType } from "./guu-node-type";
import { LanguageAnalyzer } from "../../../core/lib/analysis/language-analyzer";
import { GuuAnalysisContext } from "./guu-analysis-context";
import {
  GuuBlock,
  GuuFunctionDeclaration,
  GuuProcedureDeclaration,
} from "./guu-node";
import type { Node as GuuNode } from "./guu-node";
import type { GuuVisitorRegistry } from "./visitor-registry";
import { VisitorsRegistry } from "../../../core/lib/traversing/visitors-registry";

export class GuuLanguageAnalyzer<
  C extends GuuAnalysisContext
> extends LanguageAnalyzer<C> {
  public async analyze(path: string): Promise<void> {
    const program = await this.parse(path);

    const registry: GuuVisitorRegistry<C> = VisitorsRegistry.create();
    this.defineDesugaringRules(registry);
    this.defineAstTraversingRules(registry);

    const traverser = Traverser.create({
      context: this.context,
      root: program,
      registry: registry.fixed(),
      getNodeType: (node) => node.type,
    });

    traverser.startTraversing();
  }

  private parse(path: string): Promise<GuuNode> {
    return readFile(path, "utf8")
      .pipe(new WordStream(/[\s\t\n]/, /:/))
      .pipe(new TokensStream(new GuuTokenizer()))
      .pipe(new AstStream(new GuuAstBuilder()))
      .getProgram();
  }

  private defineDesugaringRules(registry: GuuVisitorRegistry<C>) {
    return registry.desugarWhen({
      type: GuuASTNodeType.PROCEDURE_DECLARATION,
      map(node: GuuProcedureDeclaration): GuuFunctionDeclaration {
        return new GuuFunctionDeclaration(
          node.identifier,
          [],
          new GuuBlock(node.body)
        );
      },
    });
  }

  private defineAstTraversingRules(registry: GuuVisitorRegistry<C>) {
    return registry
      .traverseIn({
        type: GuuASTNodeType.SOURCE_FILE,
        children: ["declarations"],
      })
      .traverseIn({
        type: GuuASTNodeType.BLOCK,
        children: ["statements"],
      })
      .traverseIn({
        type: GuuASTNodeType.PRINT,
        children: ["argument"],
      })
      .traverseIn({
        type: GuuASTNodeType.ASSIGNMENT,
        children: ["value"],
      })
      .traverseIn({
        type: GuuASTNodeType.PROCEDURE_DECLARATION,
        children: ["body"],
      })
      .traverseIn({
        type: GuuASTNodeType.FUNCTION_DECLARATION,
        children: ["body"],
      });
  }
}
