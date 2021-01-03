import { CheckedError } from "../errors/checked-error";
import { AnalysisContext } from "./analysis-context";
import { VisitorsRegistry } from "../traversing/visitors-registry";
import { InvalidOperationError } from "../errors";

export abstract class LanguageAnalyzer<
  T,
  C extends AnalysisContext<CheckedError>
> {
  static with<T, C extends AnalysisContext<CheckedError>>(
    context: C
  ): LanguageAnalyzer<T, C> {
    if (this === LanguageAnalyzer) {
      throw new InvalidOperationError(
        "Can't create instance of abstract class!"
      );
    }
    // @ts-expect-error contenxt will be changed, so we make a guard upper which check, that abstract class will bi not used directly
    return new this(context);
  }

  protected constructor(
    protected readonly context: C,
    public readonly visitor: VisitorsRegistry<T, C>
  ) {}

  abstract analyze(path: string): void | Promise<void>;
}
