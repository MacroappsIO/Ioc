import { test } from "@japa/runner";
import { loadModules } from "../../src/modules/Loader";
import { MetadataKeys } from "../../src/metadata";
import { ModuleLoadException } from "../../src/exceptions/ModuleLoadException";

test.group("loadModules (mocked)", () => {
  test("carrega apenas módulos com @Injectable", async ({ assert }) => {
    const files = [
      "/fake/path/moduleA.js",
      "/fake/path/moduleB.js",
      "/fake/path/broken.js",
    ];

    const globFn = async () => files;

    const dynamicImport = async (file: string) => {
      if (file.includes("moduleA")) {
        class A {}
        Reflect.defineMetadata(MetadataKeys.Injectable, true, A);
        return { A };
      }

      if (file.includes("moduleB")) {
        return { util: {} }; // não injetável
      }

      if (file.includes("broken")) {
        throw new Error("Erro no import");
      }

      return {};
    };

    const report = await loadModules(
      "/fake/**/*.ts",
      {},
      { globFn, dynamicImport }
    );

    assert.deepEqual(report.loaded, ["/fake/path/moduleA.js"]);
    assert.deepEqual(report.skipped, ["/fake/path/moduleB.js"]);
    assert.lengthOf(report.failed, 1);
    assert.instanceOf(report.failed[0].error, ModuleLoadException);
  });

  test("falha se nenhum arquivo encontrado e failOnEmpty = true", async ({
    assert,
  }) => {
    const globFn = async () => [];

    await assert.rejects(
      () => loadModules("/none/**/*.ts", { failOnEmpty: true }, { globFn }),
      /Nenhum módulo encontrado/
    );
  });

  test("interrompe ao primeiro erro se failFast = true", async ({ assert }) => {
    const globFn = async () => ["/fake/path/module.js"];
    const dynamicImport = async () => {
      throw new Error("Falha");
    };

    try {
      await loadModules(
        "/fake/**/*.ts",
        { failFast: true },
        { globFn, dynamicImport }
      );
      assert.fail("Esperava exceção mas não foi lançada");
    } catch (error) {
      assert.instanceOf(error, ModuleLoadException);
      assert.match(error.message, /Falha ao importar módulo/);
    }
  });
});
