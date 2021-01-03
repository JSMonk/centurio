import type { Typable } from "./typable";

export interface Callable {
  call<T extends readonly Typable[]>(...args: T): Typable;
}
