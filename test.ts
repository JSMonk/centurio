import { TypeChecker } from "./packages/core/lib/type-checking/type-checker";
import { CheckedError } from "./packages/core/lib/errors/checked-error";
import { AnalysisContext } from "./packages/core/lib/analysis/analysis-context";
import { TinyJSLanguageAnalyzer } from "./packages/languages/tiny-js/language";
import { TypeScriptDefinitionsAnalyzer } from "./packages/languages/typescript/type-definition";

(async () => {
  const context: any = {
    errors: [],
    language: { types: new Map() },
  };

  const checker = TypeChecker.create({
    context,
    typesystem: "./test-type-system.d.ts",
    sourceEngine: TinyJSLanguageAnalyzer,
    definitionEngine: TypeScriptDefinitionsAnalyzer
  })

  checker.run("./test.tjs");
  
  console.log(context);
})();
