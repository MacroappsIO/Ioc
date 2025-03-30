export interface LoadModuleError {
  file: string;
  error: unknown;
}

export interface LoadModulesReport {
  loaded: string[];
  failed: LoadModuleError[];
  skipped: string[];
}

export interface LoadOptions {
  failOnEmpty?: boolean;
  failFast?: boolean;
  verbose?: boolean;
}
