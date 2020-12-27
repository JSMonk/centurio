import { CheckedError } from "../errors/checked-error";

export interface AnalysysContext<E extends CheckedError> {
  errors: Array<E>;
}
