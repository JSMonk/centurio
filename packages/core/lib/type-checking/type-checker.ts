import { AnalysisContext } from "../analysis/analysis-context";
import { LanguageAnalyzer } from "../analysis/language-analyzer";
import { DefinitionAnalyzer } from "../analysis/definitions-analyzer";

type LanguageEngine<C extends AnalysisContext> = {
  with(ctx: C): LanguageAnalyzer<unknown, C>;
};

type DefinitionEngine<C extends AnalysisContext> = {
  for(language: LanguageAnalyzer<unknown, C>, ctx: C): DefinitionAnalyzer<unknown, unknown, C>;
};

export type TypeCheckerOpts<C extends AnalysisContext> = {
  context: C;
  typesystem: string;
  sourceEngine: LanguageEngine<C>;
  definitionEngine: DefinitionEngine<C>;
};

export class TypeChecker<C extends AnalysisContext> {
  static create<C extends AnalysisContext>(ops: TypeCheckerOpts<C>) {
    return new TypeChecker<C>(
      ops.sourceEngine,
      ops.definitionEngine,
      ops.context,
      ops.typesystem
    );
  }

  private constructor(
    private readonly sourceEngine: LanguageEngine<C>,
    private readonly definitionEngine: DefinitionEngine<C>,
    private readonly initialContext: C,
    private readonly typesystemPath: string
  ) {}

  run(path: string) {
    const sources = this.sourceEngine.with(this.initialContext);
    const definitions = this.definitionEngine.for(sources, this.initialContext);
    definitions.analyze(this.typesystemPath);
    sources.analyze(path);
  }
}
