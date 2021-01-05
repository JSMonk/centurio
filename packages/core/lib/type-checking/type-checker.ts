import { AnalysisContext } from "../analysis/analysis-context";
import { LanguageAnalyzer } from "../analysis/language-analyzer";

type Engine<C extends AnalysisContext> = {
  with(ctx: C): LanguageAnalyzer<unknown, C>;
};

export type TypeCheckerOpts<C extends AnalysisContext> = {
  context: C;
  typesystem: string;
  sourceEngine: Engine<C>;
  definitionEngine: Engine<C>;
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
    private readonly sourceEngine: Engine<C>,
    private readonly definitionEngine: Engine<C>,
    private readonly initialContext: C,
    private readonly typesystemPath: string
  ) {}

  run(path: string) {
    const definitions = this.definitionEngine.with(this.initialContext);
    const sources = this.sourceEngine.with(this.initialContext);
    definitions.analyze(this.typesystemPath);
    sources.analyze(path);
  }    
}
