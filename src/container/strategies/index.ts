import { ProviderResolver } from "../../types/ProviderResolver";
import { ClassResolver } from "./ClassResolver";
import { FactoryResolver } from "./FactoryResolver";
import { ValueResolver } from "./ValueResolver";

export const strategyTable = new Map<string, ProviderResolver>([
  ["class", ClassResolver],
  ["factory", FactoryResolver],
  ["value", ValueResolver],
]);
