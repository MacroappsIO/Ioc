import { test } from "@japa/runner";
import { Scope } from "../../src/container/Scope";
import type {
  ClassProvider,
  FactoryProvider,
  ValueProvider,
} from "../../src/types";

class ExampleService {
  name = "test";
}

test.group("Scope", () => {
  test("should resolve a registered value provider", ({ assert }) => {
    const scope = new Scope();

    const valueProvider: ValueProvider = {
      type: "value",
      token: "config",
      useValue: { env: "dev" },
    };

    scope.register(valueProvider);
    const resolved = scope.resolve("config");

    assert.deepEqual(resolved, { env: "dev" });
  });

  test("should resolve a registered factory provider", ({ assert }) => {
    const scope = new Scope();

    const factoryProvider: FactoryProvider = {
      type: "factory",
      token: "factory",
      useFactory: () => "built-from-factory",
      deps: [],
      scope: "singleton",
    };

    scope.register(factoryProvider);
    const result = scope.resolve("factory");

    assert.equal(result, "built-from-factory");
  });

  test("should resolve a registered class provider", ({ assert }) => {
    const scope = new Scope();

    const classProvider: ClassProvider = {
      type: "class",
      token: ExampleService,
      useClass: ExampleService,
      scope: "singleton",
    };

    scope.register(classProvider);
    const result = scope.resolve(ExampleService);

    assert.instanceOf(result, ExampleService);
    assert.equal(result.name, "test");
  });

  test("should return true if token is registered", ({ assert }) => {
    const scope = new Scope();

    scope.register({
      type: "value",
      token: "pi",
      useValue: 3.14,
    });

    assert.isTrue(scope.has("pi"));
  });

  test("should return false if token is not registered", ({ assert }) => {
    const scope = new Scope();
    assert.isFalse(scope.has("unknown"));
  });

  test("should clear all registered providers", ({ assert }) => {
    const scope = new Scope();

    scope.register({
      type: "value",
      token: "x",
      useValue: 1,
    });

    scope.clear();

    assert.isFalse(scope.has("x"));
  });

  test("should throw if trying to resolve unregistered token", ({ assert }) => {
    const scope = new Scope();

    assert.throws(() => {
      scope.resolve("not-found");
    }, /Token not registered/);
  });
});
