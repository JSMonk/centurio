import { CheckedError } from "./packages/core/lib/errors/checked-error";
import { AnalysisContext } from "./packages/core/lib/analysis/analysis-context";
import { GuuLanguageAnalyzer } from "./packages/languages/guu/language";
import { TypeScriptDefinitionsAnalyzer } from "./packages/languages/typescript/type-definition";

(async () => {
  const typeDefinitionPath = "./test-type-system.d.ts";
  const testTargetFile = "./test.guu";
  const context: AnalysisContext<CheckedError> = {
    errors: [],
    language: { types: new Map() },
  };

  const ts = TypeScriptDefinitionsAnalyzer.with(context);
  const guu = GuuLanguageAnalyzer.with(context);

  ts.analyze(typeDefinitionPath);
  guu.analyze(testTargetFile);
  
  console.log(context);
})();
