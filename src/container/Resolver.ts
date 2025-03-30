import { ProviderRegistry } from "./ProviderRegistry";
import { strategyTable } from "./strategies";
import { Provider, Token } from "../types/";

export class Resolver {
  constructor(private registry: ProviderRegistry) {}

  resolve<T>(token: Token<T>): T {
    const provider = this.registry.get(token);
    if (!provider) throw new Error(`Token not registered: ${String(token)}`);

    const strategy = strategyTable.get(provider.type);
    if (!strategy)
      throw new Error(`Unsupported provider type: ${provider.type}`);

    return strategy(provider as any, {
      resolve: this.resolve.bind(this),
    });
  }
}
