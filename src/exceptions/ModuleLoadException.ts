export class ModuleLoadException extends Error {
  public readonly file: string;
  public readonly innerError: unknown;

  constructor(file: string, error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : JSON.stringify(error);

    super(`[IoC] Failed to import module: ${file}\n→ ${message}`);

    this.name = "ModuleLoadException";
    this.file = file;
    this.innerError = error;

    Object.setPrototypeOf(this, ModuleLoadException.prototype);
  }
}
