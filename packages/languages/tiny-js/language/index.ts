import { readFile } from "../../../core/lib/parser/file";
import { AstStream } from "../../../core/lib/parser/ast-stream";
import { Traverser } from "../../../core/lib/traversing/traverser";
import { WordStream } from "../../../core/lib/parser/word-stream";
import { TinyJSTokenizer } from "./tinyjs-tokenizer";
import { TokensStream } from "../../../core/lib/parser/tokens-stream";
import { TinyJSAstBuilder } from "./ast-builder";
import { TinyJSASTNodeType } from "./tinyjs-node-type";
import { LanguageAnalyzer } from "../../../core/lib/analysis/language-analyzer";
import { TinyJSAnalysisContext } from "./tinyjs-analysis-context";
import {
  TinyJSBlock,
  TinyJSFunctionDeclaration,
  TinyJSProcedureDeclaration,
} from "./tinyjs-node";
import type { Node as TinyJSNode } from "./tinyjs-node";
import type { TinyJSVisitorRegistry } from "./visitor-registry";
import { VisitorsRegistry } from "../../../core/lib/traversing/visitors-registry";

export class TinyJSLanguageAnalyzer<
  C extends TinyJSAnalysisContext
> extends LanguageAnalyzer<C> {
  public async analyze(path: string): Promise<void> {
    const program = await this.parse(path);

    const registry: TinyJSVisitorRegistry<C> = VisitorsRegistry.create();
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

  private parse(path: string): Promise<TinyJSNode> {
    return readFile(path, "utf8")
      .pipe(new WordStream(/[\s\t\n]/, /:/))
      .pipe(new TokensStream(new TinyJSTokenizer()))
      .pipe(new AstStream(new TinyJSAstBuilder()))
      .getProgram();
  }

  private defineDesugaringRules(registry: TinyJSVisitorRegistry<C>) {
    return registry.desugarWhen({
      type: TinyJSASTNodeType.PROCEDURE_DECLARATION,
      map(node: TinyJSProcedureDeclaration): TinyJSFunctionDeclaration {
        return new TinyJSFunctionDeclaration(
          node.identifier,
          [],
          new TinyJSBlock(node.body)
        );
      },
    });
  }

  private defineAstTraversingRules(registry: TinyJSVisitorRegistry<C>) {
    return registry
      .traverseIn({
        type: TinyJSASTNodeType.SOURCE_FILE,
        children: ["declarations"],
      })
      .traverseIn({
        type: TinyJSASTNodeType.BLOCK,
        children: ["statements"],
      })
      .traverseIn({
        type: TinyJSASTNodeType.PRINT,
        children: ["argument"],
      })
      .traverseIn({
        type: TinyJSASTNodeType.ASSIGNMENT,
        children: ["value"],
      })
      .traverseIn({
        type: TinyJSASTNodeType.PROCEDURE_DECLARATION,
        children: ["body"],
      })
      .traverseIn({
        type: TinyJSASTNodeType.FUNCTION_DECLARATION,
        children: ["body"],
      });
  }
}
