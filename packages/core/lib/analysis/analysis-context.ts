import { CheckedError } from "../errors/checked-error";
import type { Type } from "../analysis/types/type";

export type TypeRegistry = Map<string, Type<object>>;

export interface LanguageContext {
  types: TypeRegistry
}

export interface AnalysisContext<E extends CheckedError> {
  errors: Array<E>;
  language: LanguageContext
}
