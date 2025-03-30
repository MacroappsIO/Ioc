export type Token<T = any> = string | symbol | Constructor<T>;

export interface Constructor<T = any> {
  new (...args: any[]): T;
}
