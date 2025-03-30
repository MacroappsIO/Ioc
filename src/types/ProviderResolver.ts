// types/ProviderResolver.ts
import { Provider } from "./Providers";
import { ResolverContext } from "./ResolverContext";

export type ProviderResolver = <T = any>(
  provider: Provider<T>,
  context: ResolverContext
) => T;
