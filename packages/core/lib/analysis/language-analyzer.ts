import { CheckedError } from "../errors/checked-error";
import { AnalysisContext } from "./analysis-context";
import { InvalidOperationError } from "../errors";

export abstract class LanguageAnalyzer<
  C extends AnalysisContext<CheckedError>
> {
  static with<C extends AnalysisContext<CheckedError>>(
    context: C
  ): LanguageAnalyzer<C> {
    if (this === LanguageAnalyzer) {
      throw new InvalidOperationError(
        "Can't create instance of abstract class!"
      );
    }
    // @ts-expect-error contenxt will be changed, so we make a guard upper which check, that abstract class will bi not used directly
    return new this(context);
  }

  protected constructor(protected readonly context: C) {}

  abstract analyze(path: string): void | Promise<void>;
}
