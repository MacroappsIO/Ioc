import { glob } from "fs";
import { ModuleLoadException } from "../exceptions/ModuleLoadException";
import { MetadataKeys } from "../metadata";
import { LoadOptions, LoadModulesReport } from "../types";

type GlobFunction = (
  patterns: string | string[],
  options: any
) => Promise<string[]>;

export async function loadModules(
  patterns: string | string[],
  options: LoadOptions = {},
  {
    globFn = glob as GlobFunction,
    dynamicImport = (file: string) => import(file),
  }: {
    globFn?: GlobFunction;
    dynamicImport?: (file: string) => Promise<any>;
  } = {}
): Promise<LoadModulesReport> {
  const report: LoadModulesReport = {
    loaded: [],
    failed: [],
    skipped: [],
  };

  const files = await globFn(patterns, { absolute: true });

  if (options.failOnEmpty && files.length === 0) {
    throw new Error("[IoC] No module found for the given pattern.");
  }

  for (const file of files) {
    try {
      const mod = await dynamicImport(file);

      const hasInjectable = Object.values(mod).some((exported) => {
        const isValid =
          typeof exported === "function" ||
          (typeof exported === "object" && exported !== null);
        return (
          isValid && Reflect.hasMetadata(MetadataKeys.Injectable, exported)
        );
      });

      if (!hasInjectable) {
        report.skipped.push(file);
        if (options.verbose) {
          console.warn(`[IoC] ${file} does not contain any @Injectable class.`);
        }
        continue;
      }

      report.loaded.push(file);
      if (options.verbose) {
        console.info(`[IoC] Loaded: ${file}`);
      }
    } catch (error: unknown) {
      const wrapped = new ModuleLoadException(file, error);
      report.failed.push({ file, error: wrapped });

      if (options.verbose && wrapped.innerError instanceof Error) {
        console.error(wrapped.innerError.stack);
      }

      if (options.failFast) {
        throw wrapped;
      }
    }
  }

  return report;
}
