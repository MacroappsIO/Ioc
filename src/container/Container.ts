import { Scope } from "./Scope";
import { Token, Constructor, ProviderScope, Provider } from "../types/";

export class Container extends Scope {
  public bind<T>(token: Token<T>) {
    return {
      to: (useClass: Constructor<T>) => {
        const provider: Provider<T> = {
          type: "class",
          token,
          useClass,
          scope: "singleton",
        };
        this.register(provider);
        return {
          asSingleton: () => (provider.scope = "singleton"),
          asTransient: () => (provider.scope = "transient"),
        };
      },
    };
  }

  public bindFactory<T>(
    token: Token<T>,
    factory: (...args: any[]) => T,
    deps: Token[] = []
  ) {
    const provider: Provider<T> = {
      type: "factory",
      token,
      useFactory: factory,
      deps,
      scope: "singleton",
    };
    this.register(provider);
    return {
      asSingleton: () => (provider.scope = "singleton"),
      asTransient: () => (provider.scope = "transient"),
    };
  }

  public bindValue<T>(token: Token<T>, value: T) {
    const provider: Provider<T> = {
      type: "value",
      token,
      useValue: value,
    };
    this.register(provider);
  }

  public createScope(): Container {
    return new Container();
  }
}
