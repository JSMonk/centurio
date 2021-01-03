import type { Call } from "./call";
import type { Variable } from "./variable";

export interface Scope {
  variables: Map<string, Variable>;
  calls: Call[];
}
