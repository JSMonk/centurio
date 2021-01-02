import type { VisitorsRegistry } from "../../../core/lib/traversing/visitors-registry";
import type { TinyJSASTNodeType } from "./tinyjs-node-type";

export type TinyJSVisitorRegistry<Context extends object> = VisitorsRegistry<
  TinyJSASTNodeType,
  Context
>;
