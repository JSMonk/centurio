import type { GuuASTNodeType } from "./guu-node-type";
import type { VisitorsRegistry } from "../../../core/lib/traversing/visitors-registry";

export type GuuVisitorRegistry<Context extends object> = VisitorsRegistry<
  GuuASTNodeType,
  Context
>;
