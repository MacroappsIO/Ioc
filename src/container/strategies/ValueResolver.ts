import { ValueProvider, ProviderResolver } from "../../types/";

export const ValueResolver: ProviderResolver = (provider) => {
  const typed = provider as ValueProvider;
  return typed.useValue;
};
