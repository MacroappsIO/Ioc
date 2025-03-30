import { Token } from "./Token";
import { Provider } from "./Providers";

export interface Scope {
  register<T>(provider: Provider<T>): void;
  resolve<T>(token: Token<T>): T;
  clear(): void;
  has<T>(token: Token<T>): boolean;
}
