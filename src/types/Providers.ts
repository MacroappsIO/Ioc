import { Constructor, Token } from "./Token";

export type ProviderScope = "singleton" | "transient";

export interface ClassProvider<T = any> {
  type: "class";
  token: Token<T>;
  useClass: Constructor<T>;
  scope: ProviderScope;
  instance?: T;
}

export interface FactoryProvider<T = any> {
  type: "factory";
  token: Token<T>;
  useFactory: (...args: any[]) => T;
  deps: Token[];
  scope: ProviderScope;
  instance?: T;
}

export interface ValueProvider<T = any> {
  type: "value";
  token: Token<T>;
  useValue: T;
}

export type Provider<T = any> =
  | ClassProvider<T>
  | FactoryProvider<T>
  | ValueProvider<T>;
