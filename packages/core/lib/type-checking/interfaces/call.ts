import type { Typable } from "./typable";
import type { Callable } from "./callable";

export interface Call extends Typable {
  args: Typable[];
  callee: Typable & Callable;
}
