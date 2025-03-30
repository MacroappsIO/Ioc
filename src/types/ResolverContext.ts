import { Token } from "./Token";

export interface ResolverContext {
  resolve<T>(token: Token<T>): T;
}
