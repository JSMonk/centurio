import { CheckedError } from "./packages/core/lib/errors/checked-error";
import { AnalysisContext } from "./packages/core/lib/analysis/analysis-context";
import { TinyJSLanguageAnalyzer } from "./packages/languages/tiny-js/language";
import { TypeScriptDefinitionsAnalyzer } from "./packages/languages/typescript/type-definition";

(async () => {
  const typeDefinitionPath = "./test-type-system.d.ts";
  const testTargetFile = "./test.tjs";

  const context: AnalysisContext<CheckedError> = {
    errors: [],
    language: { types: new Map() },
  };

  const ts = TypeScriptDefinitionsAnalyzer.with(context);
  const tinyjs = TinyJSLanguageAnalyzer.with(context);

  ts.analyze(typeDefinitionPath);
  tinyjs.analyze(testTargetFile);
  
  console.log(context);
})();
