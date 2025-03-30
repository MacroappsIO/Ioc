import { ProviderRegistry } from "./ProviderRegistry";
import { strategyTable } from "./strategies";
import { Provider, Token } from "../types/";

export class Resolver {
  constructor(private registry: ProviderRegistry) {}

  resolve<T>(token: Token<T>): T {
    const provider = this.registry.get(token);
    if (!provider) throw new Error(`Token não registrado: ${String(token)}`);

    const strategy = strategyTable.get(provider.type);
    if (!strategy)
      throw new Error(`Tipo de provider não suportado: ${provider.type}`);

    return strategy(provider as any, {
      resolve: this.resolve.bind(this),
    });
  }
}
