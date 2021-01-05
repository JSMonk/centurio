import { CheckedError } from "../errors/checked-error";
import type { Type } from "../type-checking/interfaces/type";
import type { Scope } from "../type-checking/interfaces/scope";

export type TypeRegistry = Map<string, Type<object>>;

export interface LanguageContext {
  types: TypeRegistry
}

export interface AnalysisContext<E extends CheckedError = CheckedError> {
  errors: Array<E>;
  scope: Scope;
  language: LanguageContext;
}
