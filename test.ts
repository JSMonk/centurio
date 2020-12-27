import { readFile } from "./packages/core/lib/parser/file";
import { AstStream } from "./packages/core/lib/parser/ast-stream";
import { Traverser } from "./packages/core/lib/traversing/traverser";
import { WordStream } from "./packages/core/lib/parser/word-stream";
import { CheckedError } from "./packages/core/lib/errors/checked-error";
import { GuuTokenizer } from "./packages/core/guu-example/guu-tokenizer";
import { TokensStream } from "./packages/core/lib/parser/tokens-stream";
import { GuuAstBuilder } from "./packages/core/guu-example/ast-builder";
import { GuuASTNodeType } from "./packages/core/guu-example/guu-node-type";
import { AnalysysContext } from "./packages/core/lib/analysis/analysis-context";
import { VisitorsRegistry } from "./packages/core/lib/traversing/visitors-registry";
import type { EnumToUnion } from "./packages/core/lib/util/enum-to-union";
import type { Node as GuuNode } from "./packages/core/guu-example/guu-node";
import {
  GuuBlock,
  GuuFunctionDeclaration,
  GuuProcedureDeclaration,
} from "./packages/core/guu-example/guu-node";

(async () => {
  // Parsing
  const program: GuuNode = await readFile("./test.guu", "utf8")
    .pipe(new WordStream(/[\s\t\n]/, /:/))
    .pipe(new TokensStream(new GuuTokenizer()))
    .pipe(new AstStream(new GuuAstBuilder()))
    .getProgram();

  const context: AnalysysContext<CheckedError> = { errors: [] };

  const registry = VisitorsRegistry.create<
    EnumToUnion<typeof GuuASTNodeType>,
    AnalysysContext<CheckedError>
  >();

  // How to traverse given AST
  defineTraversingRules(registry);
  // Desugar rules for current AST
  defineDesugaringRules(registry);
  // How analyze current AST
  defineAnalysisRules(registry);

  const traverser = Traverser.create(program, context, registry.fixed());

  traverser.startTraversing();
})();

function defineTraversingRules(
  registry: VisitorsRegistry<
    EnumToUnion<typeof GuuASTNodeType>,
    AnalysysContext<CheckedError>
  >
) {
  registry
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

function defineDesugaringRules(
  registry: VisitorsRegistry<
    EnumToUnion<typeof GuuASTNodeType>,
    AnalysysContext<CheckedError>
  >
) {
  registry.desugarWhen({
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

function defineAnalysisRules(
  registry: VisitorsRegistry<
    EnumToUnion<typeof GuuASTNodeType>,
    AnalysysContext<CheckedError>
  >
) {
  registry.analyse({
    type: GuuASTNodeType.FUNCTION_DECLARATION,
    analyze(node: GuuFunctionDeclaration) {
      console.log("Catch: ", JSON.stringify(node, null, 2));
    },
  });
}
