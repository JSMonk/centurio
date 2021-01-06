import { CheckedError } from "../errors/checked-error";
import { AnalysisContext } from "./analysis-context";
import { LanguageAnalyzer } from "./language-analyzer";
import { InvalidOperationError } from "../errors";

export abstract class DefinitionAnalyzer<
  T,
  N,
  C extends AnalysisContext<CheckedError>
> extends LanguageAnalyzer<T, C> {
  static for<T, N, C extends AnalysisContext<CheckedError>>(
    language: LanguageAnalyzer<N, C>,
    context: C
  ): DefinitionAnalyzer<T, N, C> {
    if (this === DefinitionAnalyzer) {
      throw new InvalidOperationError(
        "Can't create instance of abstract class!"
      );
    }
    // @ts-expect-error contenxt will be changed, so we make a guard upper which check, that abstract class will bi not used directly
    return new this(language, context);
  }
  
  protected constructor(
    protected readonly language: LanguageAnalyzer<N, C>,
    context: C
  ) {
    super(context);
  }
}
