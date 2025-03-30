import { ProviderRegistry } from "./ProviderRegistry";
import { Resolver } from "./Resolver";
import { Scope as IScope, Token, Provider } from "../types";

export class Scope implements IScope {
  private registry = new ProviderRegistry();
  private resolver = new Resolver(this.registry);

  register<T>(provider: Provider<T>): void {
    this.registry.register(provider);
  }

  resolve<T>(token: Token<T>): T {
    return this.resolver.resolve(token);
  }

  has<T>(token: Token<T>): boolean {
    return this.registry.has(token);
  }

  clear(): void {
    this.registry.clear();
  }
}
