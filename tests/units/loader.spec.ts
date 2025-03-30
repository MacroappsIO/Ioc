import { test } from "@japa/runner";
import { loadModules } from "../../src/modules/Loader";
import { MetadataKeys } from "../../src/metadata";
import { ModuleLoadException } from "../../src/exceptions/ModuleLoadException";

test.group("loadModules() with mocks", () => {
  test("should load only modules decorated with @Injectable", async ({
    assert,
  }) => {
    const mockFiles = [
      "/fake/path/moduleA.js",
      "/fake/path/moduleB.js",
      "/fake/path/broken.js",
    ];

    const globFn = async () => mockFiles;

    const dynamicImport = async (file: string) => {
      if (file.includes("moduleA")) {
        class A {}
        Reflect.defineMetadata(MetadataKeys.Injectable, true, A);
        return { A };
      }

      if (file.includes("moduleB")) {
        return { util: {} }; // not decorated
      }

      if (file.includes("broken")) {
        throw new Error("Import failure");
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

  test("should throw if no files found and failOnEmpty = true", async ({
    assert,
  }) => {
    const globFn = async () => [];

    await assert.rejects(
      () => loadModules("/none/**/*.ts", { failOnEmpty: true }, { globFn }),
      /No module found/
    );
  });

  test("should abort immediately if failFast = true and import fails", async ({
    assert,
  }) => {
    const globFn = async () => ["/fake/path/module.js"];
    const dynamicImport = async () => {
      throw new Error("Failure");
    };

    try {
      await loadModules(
        "/fake/**/*.ts",
        { failFast: true },
        { globFn, dynamicImport }
      );
      assert.fail("Expected exception was not thrown");
    } catch (error) {
      assert.instanceOf(error, ModuleLoadException);
      assert.match(error.message, /Failed to import module/);
    }
  });
});
