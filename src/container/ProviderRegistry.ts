import { Provider, Token } from "../types";

export class ProviderRegistry {
  private providers = new Map<Token, Provider>();

  register<T>(provider: Provider<T>): void {
    this.providers.set(provider.token, provider);
  }

  get<T>(token: Token<T>): Provider<T> | undefined {
    return this.providers.get(token);
  }

  has<T>(token: Token<T>): boolean {
    return this.providers.has(token);
  }

  clear(): void {
    this.providers.clear();
  }

  all(): Provider[] {
    return Array.from(this.providers.values());
  }
}
