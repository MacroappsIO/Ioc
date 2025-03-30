import { FactoryProvider, ProviderResolver } from "../../types/";

export const FactoryResolver: ProviderResolver = (provider, ctx) => {
  const typed = provider as FactoryProvider;
  if (typed.scope === "singleton" && typed.instance) return typed.instance;

  const args = typed.deps.map((dep) => ctx.resolve(dep));
  const instance = typed.useFactory(...args);

  if (typed.scope === "singleton") typed.instance = instance;
  return instance;
};
