import { ClassProvider, ProviderResolver, OnInit } from "../../types";
import { MetadataKeys } from "../../metadata/MetadataKeys";

export const ClassResolver: ProviderResolver = (provider, ctx) => {
  const typed = provider as ClassProvider;
  if (typed.scope === "singleton" && typed.instance) return typed.instance;

  const paramTypes: any[] =
    Reflect.getMetadata("design:paramtypes", typed.useClass) || [];

  const injectTokens: any[] =
    Reflect.getMetadata(MetadataKeys.InjectParams, typed.useClass) || [];

  const args = paramTypes.map((type, i) => {
    const depToken = injectTokens[i] || type;
    return ctx.resolve(depToken);
  });

  const instance = new typed.useClass(...args);

  if ("onInit" in instance) (instance as OnInit).onInit?.();
  if (typed.scope === "singleton") typed.instance = instance;

  return instance;
};
